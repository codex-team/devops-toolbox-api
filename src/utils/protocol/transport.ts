import ws from 'ws';
import WorkspacesService from '../../services/workspace';
import WorkspacesController from '../../controllers/workspaces';
import ConnectedClients from './connectedClients';
// import { Client, TransportOptions, OutgoingMessage, ResponseMessage, MessagePayload, IncomingMessage } from './types';
import http from 'http';
import { CriticalError, MessageFormatError, MessageParseError } from './errors';
import { IncomingMessage, OutgoingMessage } from './types';
import { CloseEventCode } from './closeEvent';
import Client from './client';
import { AuthData, AuthRequestPayload } from './types/auth';

/**
 * All socket messages supported by Transport should have
 *  'messageId' and 'type' as string
 *  and
 *  'payload' as object
 *
 * But before the type-validation we should treat them as possible invalid with unknown types
 */
type PossibleInvalidMessage = Record<string, any>;

export interface TransportOptions {
  port?: number;

  onAuth: (authRequestPayload: AuthRequestPayload) => Promise<AuthData>;
  onMessage: (message: IncomingMessage) => Promise<void>;

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
 * @todo send errors via OutgoingMessage
 */
export class Transport {
  private clients: ConnectedClients = new ConnectedClients();
  private readonly wsServer: ws.Server;
  private connectedClients: Client[] = [];
  private options: TransportOptions;

  /**
   * Constructor
   *
   * @param options - Transport options
   * @param WebSocketsServer - allows to override the 'ws' dependency. Used for mocking it in tests.
   */
  constructor(options: TransportOptions, WebSocketsServer?: ws.Server) {
    this.options = options;
    this.wsServer = WebSocketsServer || new ws.Server(Object.assign({
      /**
       * Do not save clients in ws.clients propery
       * because we will use own Map (this.connectedClients)
       */
      clientTracking: false,
    }, options), () => {
      this.log(`Server is running at ws://localhost:${options.port}}`);
    });

    /**
     *  Client connects
     */
    this.wsServer.on('connection', (socket: ws, request: http.IncomingMessage) => {
      /**
       * We will close the socket if there is no messaegs for 3 seconds
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
        socket.close(CloseEventCode.TryAgainLater, 'Authorization requiered');
      }, msgWaitingTime);
    });
  }

  /**
   * Method for connection event
   *
   * @param socket - socket
   * @param request - additional GET request from client
   */
  // private onconnection = async (socket: ws): Promise<void> => {
  //   /**
  //    * Connected client's workspaces list
  //    */
  //   socket.on('message', this.onmessage);

  //   /**
  //    * Сlient disconnecting handler
  //    */
  //   socket.on('close', this.onclose);

  //   /**
  //    * Sockets error handler
  //    */
  //   socket.on('error', this.onerror);
  // }

  /**
   * Method for message event
   *
   * @param socket - socket
   * @param data - message data
   */
  private async onmessage(socket: ws, data: ws.Data): Promise<void> {
    try {
      this.validateMessage(data as string);
    } catch (error) {
      this.log(`Wrong message accepted: ${error.message} `, data);

      if (error instanceof CriticalError) {
        socket.close(CloseEventCode.UnsupportedData, error.message);
      } else {
        socket.send('Message Format Error: ' + error.message);
      }

      return;
    }

    const message = JSON.parse(data as string);
    const isFirstMessage = !this.clients.exists((client: Client) => client.socket === socket);

    if (isFirstMessage) {
      this.handleFirstMessage(socket, message);
    }
  }

  /**
   * Process the first message:
   *  - check auhtorisation
   *  - save client
   *
   * @param socket - connected socket
   * @param message - accepted message
   */
  private async handleFirstMessage(socket: ws, message: IncomingMessage): Promise<void> {
    if (message.type !== 'authorize') {
      socket.close(CloseEventCode.PolicyViolation, 'Unauthorized');

      return;
    }

    try {
      const authData = await this.options.onAuth(message.payload);

      console.log('success auth', authData)
      const clientToSave = new Client(socket, authData);

      this.clients.add(clientToSave);

      /**
       * Respond with success message and auth data
       */
      socket.send(JSON.stringify({
        type: 'auth-success',
        payload: authData,
      } as OutgoingMessage));
    } catch (error) {
      socket.close(CloseEventCode.PolicyViolation, 'Authorization failed: ' + error.message);
    }
  }

  /**
   * Chech if passed message fits the protocol format.
   * Will throw an error if case of problems.
   * If everthing is ok, return void
   *
   * @param message - string got from client by socket
   */
  private validateMessage(message: string): void {
    /**
     * Check for message type
     */
    if (typeof message !== 'string') {
      throw new MessageParseError('Unsupported data');
    }

    /**
     * Check for JSON validness
     */
    let parsedMessage: IncomingMessage;

    try {
      parsedMessage = JSON.parse(message) as IncomingMessage;
    } catch (parsingError) {
      this.log('Message parsing error: ' + parsingError.message);

      throw new MessageParseError(parsingError.message);
    }

    /**
     * Check for required fields
     */
    const requiredMessageFields = ['messageId', 'type', 'payload'];

    requiredMessageFields.forEach((field) => {
      if ((parsedMessage as PossibleInvalidMessage)[field] === undefined) {
        throw new MessageFormatError(`"${field}" field missed`);
      }
    });

    /**
     * Check fields type
     */
    const fieldTypes = {
      messageId: 'string',
      type: 'string',
      payload: 'object',
    };

    Object.entries(fieldTypes).forEach(([name, type]) => {
      const value = (parsedMessage as PossibleInvalidMessage)[name];

      // eslint-disable-next-line valid-typeof
      if (typeof value !== type) {
        throw new MessageFormatError(`"${name}" should be ${type === 'object' ? 'an' : 'a'} ${type}`);
      }
    });
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
   * Method for close event
   *
   * @private
   * @param this - socket
   */
  // private onclose(this: ws): void {
  //   Transport.clients.remove(this);
  // }

  /**
   * Method for error event
   *
   * @private
   * @param this - socket
   */
  // private onerror(this: ws): void {
  //   Transport.clients.remove(this);
  // }
}
