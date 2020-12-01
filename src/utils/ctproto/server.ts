import ws from 'ws';

import { CriticalError } from './errors';
import { CloseEventCode } from './closeEvent';
import Client from './client';
import { NewMessage, AuthData, AuthRequestPayload } from './types';
import ClientsList from './clientsList';
import MessageFactory from './messageFactory';
import MessageValidator from './messageValidator';

export interface CTProtoServerOptions {
  /**
   * WebSocket server port
   */
  port?: number;

  /**
   * Allows to accept connection only from this route
   */
  path?: string;

  /**
   * Method for socket authorization
   * Will be called when client will send the 'authorize' request.
   *
   * @param authRequestPayload - any app-related data for authorization.
   * @returns authorized client data
   */
  onAuth: (authRequestPayload: AuthRequestPayload) => AuthData | Promise<AuthData>;

  /**
   * Method for handling messages
   * Will be called on every message after authorization.
   *
   * @param message - full message data
   * @returns optionally can return any data to respond to client
   */
  onMessage: (message: NewMessage) => Promise<void | Record<string, unknown>>;

  /**
   * Allows to disable validation/authorisation and other warning messages
   */
  disableLogs?: boolean;
}

/**
 * ヽ(͡◕ ͜ʖ ͡◕)ﾉ
 *
 * Class Transport (Transport level + Presentation level)
 *
 *
 * @todo strict connections only from /client route
 * @todo use Logger instead of console
 * @todo close broken connection ping-pong (https://github.com/websockets/ws#how-to-detect-and-close-broken-connections)
 * @todo implement the 'destroy()' method that will stop the server
 */
export class CTProtoServer {
  /**
   * Manager of currently connected clients
   * Allows to find, send and other manipulations.
   */
  public clients: ClientsList = new ClientsList();

  /**
   * Instance of transport-layer framework
   * In our case, this is a 'ws' server
   */
  private readonly wsServer: ws.Server;

  /**
   * Configuration options passed on Transport initialization
   */
  private options: CTProtoServerOptions;

  /**
   * Constructor
   *
   * @param options - Transport options
   * @param WebSocketsServer - allows to override the 'ws' dependency. Used for mocking it in tests.
   */
  constructor(options: CTProtoServerOptions, WebSocketsServer?: ws.Server) {
    this.options = options;
    this.wsServer = WebSocketsServer || new ws.Server({
      port: options.port,
      path: options.path,
      /**
       * Do not save clients in ws.clients property
       * because we will use own Map (this.ClientsList)
       */
      clientTracking: false,
    }, () => {
      this.log(`Server is running at ws://localhost:${options.port}}`);
    });

    /**
     *  Client connects
     */
    this.wsServer.on('connection', (socket: ws) => {
      /**
       * We will close the socket if there is no messages for 3 seconds
       */
      let msgWaiter: NodeJS.Timeout;
      const msgWaitingTime = 3000;

      socket.on('message', (message: ws.Data) => {
        if (msgWaiter) {
          clearTimeout(msgWaiter);
        }

        this.onmessage(socket, message);
      });

      msgWaiter = setTimeout(() => {
        socket.close(CloseEventCode.TryAgainLater, 'Authorization required');
      }, msgWaitingTime);

      /**
       * Client disconnecting handler
       */
      socket.on('close', () => this.onclose(socket));

      /**
       * Sockets error handler
       */
      socket.on('error', () => this.onerror(socket));
    });
  }

  /**
   * Method for message event
   *
   * @param socket - socket
   * @param data - message data
   */
  private async onmessage(socket: ws, data: ws.Data): Promise<void> {
    try {
      MessageValidator.validateMessage(data as string);
    } catch (error) {
      this.log(`Wrong message accepted: ${error.message} `, data);

      if (error instanceof CriticalError) {
        socket.close(CloseEventCode.UnsupportedData, error.message);
      } else {
        socket.send(MessageFactory.createError('Message Format Error: ' + error.message));
      }

      return;
    }

    const message = JSON.parse(data as string);
    const isFirstMessage = !this.clients.find((client: Client) => client.socket === socket).exists();

    if (isFirstMessage) {
      this.handleFirstMessage(socket, message);
    } else {
      this.handleAuthorizedMessage(socket, message);
    }
  }

  /**
   * Process the first message:
   *  - check authorization
   *  - save client
   *
   * @param socket - connected socket
   * @param message - accepted message
   */
  private async handleFirstMessage(socket: ws, message: NewMessage): Promise<void> {
    if (message.type !== 'authorize') {
      socket.close(CloseEventCode.PolicyViolation, 'Unauthorized');

      return;
    }

    try {
      const authData = await this.options.onAuth(message.payload);
      const clientToSave = new Client(socket, authData);

      this.clients.add(clientToSave);

      /**
       * Respond with success message and auth data
       */
      socket.send(MessageFactory.respond(message.messageId, authData));
    } catch (error) {
      socket.close(CloseEventCode.PolicyViolation, 'Authorization failed: ' + error.message);
    }
  }

  /**
   * Process not-first message.
   *
   * @param socket - connected socket
   * @param message - accepted message
   */
  private async handleAuthorizedMessage(socket: ws, message: NewMessage): Promise<void> {
    if (message.type == 'authorize') {
      return;
    }

    try {
      const response = await this.options.onMessage(message);

      /**
       * Controller may not returning anything.
       */
      if (!response) {
        return;
      }

      /**
       * Respond with payload got from the onMessage handler
       */
      socket.send(MessageFactory.respond(message.messageId, response));
    } catch (error) {
      this.log('Internal error while processing a message: ', error.message);
    }
  }

  /**
   * Log some string
   *
   * @param text - what to log
   * @param context - additional data to log
   */
  private log(text: string, context?: unknown): void {
    const prefix = 'CTProto ♥';

    if (this.options.disableLogs) {
      return;
    }

    if (context === undefined) {
      console.log(`${prefix} ${text}`);
    } else {
      console.log(`${prefix} ${text}`, context);
    }
  }

  /**
   * Socket disconnection handler
   *
   * @param socket - disconnected socket
   */
  private onclose(socket: ws): void {
    this.clients.find((client: Client) => client.socket === socket).remove();
  }

  /**
   * Handler for socket connection error
   *
   * @param socket - connected socket
   */
  private onerror(socket: ws): void {
    this.clients.find((client: Client) => client.socket === socket).remove();
  }
}
