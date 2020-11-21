import ws from 'ws';
import WorkspacesService from '../../services/workspace';
import WorkspacesController from '../../controllers/workspaces';
import ClientsList from './clientsList';
import { Client, TransportOptions, OutgoingMessage, ResponseMessage, MessagePayload, IncomingMessage } from './types';
import http from 'http';

/**
 * Class Transport (Transport level)
 */
export default class Transport {
  /**
   * @private clients - Currently connected clients
   */
  private static clients: ClientsList = ClientsList.getAll();

  /**
   * @private wsServer: websocket server
   */
  private readonly wsServer: ws.Server;

  /**
   * Constructor
   *
   * @param options - Transport options
   */
  constructor(options: TransportOptions) {
    this.wsServer = new ws.Server(options, () => {
      console.log(`⚡️[server]: Server is running at ws://localhost:${options.port}/${options.path}`);
    });

    /**
     *  Client connects
     */
    this.wsServer.on('connection', this.onconnection);
  }

  /**
   * Method for sending a messages initiated by the API
   *
   * @param client - client to whom the message is sending
   * @param type - type of message
   * @param payload - any payload
   */
  public static send(client: Client, type: string, payload: MessagePayload): void {
    const message: OutgoingMessage = {
      type,
      payload,
      messageId: null,
    };

    client.socket.send(JSON.stringify(message));
  }

  /**
   * Method for sending a response
   *
   * @param socket - client
   * @param messageId - message id which we use to send response with this id
   * @param payload - any payload
   */
  public static respond(socket: ws, messageId: string, payload: MessagePayload): void {
    const message: ResponseMessage = {
      payload,
      messageId,
    };

    socket.send(JSON.stringify(message));
  }

  /**
   * Method for connection event
   *
   * @param socket - socket
   * @param request - additional GET request from client
   */
  private onconnection = async (socket: ws, request: http.IncomingMessage): Promise<void> => {
    /**
     * Connected client's authorization token
     */

    const authToken: string | undefined = request.headers.authorization;

    /**
     * Connected client's workspaces list
     */
    const workspaces = await WorkspacesService.find({ authToken });

    if (!workspaces?.length) {
      /**
       * 1007 - Wrong request (https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)
       */
      socket.close(1007, 'Wrong authorization token');
    }

    const client: Client = {
      socket,
      workspaceIds: workspaces?.map(workspace => workspace._id),
    };

    Transport.clients.add(client);
    /**
     * Connected client's workspaces list
     */
    socket.on('message', this.onmessage);

    /**
     * Сlient disconnecting handler
     */
    socket.on('close', this.onclose);

    /**
     * Sockets error handler
     */
    socket.on('error', this.onerror);
  }

  /**
   * Method for message event
   *
   * @param this - socket
   * @param data - message data
   * @private
   */
  private async onmessage(this: ws, data: string): Promise<void> {
    const dataObj: IncomingMessage = JSON.parse(data);

    const payload: MessagePayload = {};

    switch (dataObj.type) {
      case 'getWorkspaces':
        payload.workspaces = await WorkspacesController.getWorkspaces(dataObj.payload.authToken);
        break;
    }

    Transport.respond(this, dataObj.messageId, payload);
  }

  /**
   * Method for close event
   *
   * @private
   * @param this - socket
   */
  private onclose(this: ws): void {
    Transport.clients.remove(this);
  }

  /**
   * Method for error event
   *
   * @private
   * @param this - socket
   */
  private onerror(this: ws): void {
    Transport.clients.remove(this);
  }
}
