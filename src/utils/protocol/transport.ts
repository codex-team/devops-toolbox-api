import ws from 'ws';
import express from 'express';
import WorkspacesService from '../../services/workspace';
import WorkspacesController from '../../controllers/workspaces';
import ClientsList from '../clientsList';
import { Client } from '../../types';
import { TransportOptions, OutgoingMessage, ResponseMessage, MessagePayload, IncomingMessage } from './types';
import MessageCreator from './messageCreator';

/**
 * Class Transport (Transport level)
 */
export default class Transport {
  /**
   * @private
   */
  private static clients: ClientsList = ClientsList.getAll();

  /**
   * Constructor
   *
   * @param options - Transport options
   */
  constructor(options: TransportOptions) {
    const server = new ws.Server({
      port: options.port,
      path: options.path,
    }, () => {
      console.log(`⚡️[server]: Server is running at ws://localhost:${options.port}/${options.path}`);
    });

    /**
     *  Client connects
     */
    server.on('connection', this.connection);
  }

  /**
   * Method for sending a messages to the client
   *
   * @param socket - client
   * @param message - message
   */
  public static send(socket: ws, message: ResponseMessage | OutgoingMessage): void {
    socket.send(JSON.stringify(message));
  }

  /**
   * Method for connection event
   *
   * @param socket - socket
   * @param req - additional GET request from client
   */
  public async connection(socket: ws, req: express.Request): Promise<void> {
    /**
     * Connected client's authorization token
     */
    const authToken: string | undefined = req.headers.authorization;

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
        payload.workspaces = await WorkspacesController.getWorkspaces();
        break;
    }

    const message: ResponseMessage | OutgoingMessage = MessageCreator.create(dataObj.type, dataObj.messageId, payload);

    Transport.send(this, message);
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
