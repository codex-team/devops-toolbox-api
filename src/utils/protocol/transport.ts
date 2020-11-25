import ws from 'ws';
import WorkspacesService from '../../services/workspace';
import WorkspacesController from '../../controllers/workspaces';
import ConnectedClients from './connectedClients';
// import { Client, TransportOptions, OutgoingMessage, ResponseMessage, MessagePayload, IncomingMessage } from './types';
import http from 'http';
import { CriticalError, MessageFormatError, MessageParseError } from './errors';
import { IncomingMessage } from './types';
import { CloseEventCode } from './closeEvent';
import Client from './client';

export interface AuthData {
}

type AuthRequestPayload = {[key: string]: string | number }

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
}

/**
 * Class Transport (Transport level)
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
      console.log(`⚡️[server]: Server is running at ws://localhost:${options.port}}`);
    });

    /**
     *  Client connects
     */
    this.wsServer.on('connection', (socket: ws, request: http.IncomingMessage) => {
      /**
       * Connected client's workspaces list
       */
      socket.on('message', (message: ws.Data) => {
        this.onmessage(socket, message);
      });
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
   * @private
   */
  private async onmessage(socket: ws, data: ws.Data): Promise<void> {
    let parsedMessage: IncomingMessage;

    try {
      parsedMessage = this.parseAndValidateMessage(data as string);
    } catch (error) {
      console.log(`Wrong message accepted: ${error.message} `, data);

      if (error instanceof CriticalError) {
        socket.close(CloseEventCode.UnsupportedData, error.message);
      } else {
        socket.send('Message Format Error: ' + error.message);

        return;
      }
    }




    // this.authorizeClient()

    // const socketId = Date.now();
    const alreadyConnected = this.clients.find((client: Client) => client.socket === socket);

    console.log('alreadyConnected', alreadyConnected);




    /**
     * 1. The first message should be 'authorize'
     * 2. If the 'authorize' message wan not accepted for 5 sec after connection, then close connection.
     * 4. Authorisation should be implemented outside.
     * 4. If the client is already authorized, we shouldn't accept the 'authorize' request.
     * 5.
     */

    // if (!alreadyConnected) {
    //   if (message.type !== 'authorize') {
    //     socket.close(1007, 'Authentication required');
    //   }

    //   try {
    //     const authData = await this.options.onAuth(message.payload);

    //     this.clients.add(new Client(
    //       socket,
    //       authData
    //     ));
    //   } catch (error) {
    //     socket.close(1007, 'Authentication failed');
    //   }
    // } else {
    //   const response = await this.options.onMessage(message.payload);
    // }

    // if (!this.connectedClients.has(socketId)){
    //   this.connectedClients.set(socketId, socket);
    // }

    // console.log('ok', this.wsServer.clients);
    // console.log('map', this.connectedClients  );
  }

  /**
   * Chech if passed object fits the protocol message format
   *
   * @param message - object got from client
   */
  private parseAndValidateMessage(message: string): IncomingMessage {
    if (typeof message !== 'string') {
      throw new MessageParseError('Unsupported data');
    }

    let parsedMessage: IncomingMessage;

    try {
      parsedMessage = JSON.parse(message) as IncomingMessage;
    } catch (parsingError) {
      console.error('Message parsing error', parsingError.message);

      throw new MessageParseError(parsingError.message);
    }

    /**
     * This fields MUST exist in a message
     */
    const requiredMessageFields = ['messageId', 'type', 'payload'];

    requiredMessageFields.forEach((field) => {
      if ((parsedMessage as PossibleInvalidMessage)[field] === undefined) {
        throw new MessageFormatError(`"${field}" field missed`);
      }
    });

     /**
     * Field -> type validation
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

    return parsedMessage;
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
