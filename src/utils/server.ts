import ws from 'ws';
import express from 'express';
import WorkspacesService from '../services/workspace';
import WorkspacesController from '../controllers/workspaces';
import ClientsList from './clientsList';
import { OutgoingMessage, ResponseMessage, MessagePayload, Message, Client, IncomingMessage } from '../types';

/**
 * Class Server (Transport level)
 */
export default class Server {
  /**
   * @private clients - currently connected clients
   */
  private static clients: ClientsList = ClientsList.getAll();

  /**
   * Method for sending a messages to the client
   *
   * @param socket - client
   * @param messageId - message Id
   * @param payload - payload
   */
  public static send(socket: ws, messageId: string | null, payload: object): void {
    const message: Message = {
      payload,
    };

    if (messageId) {
      const response: ResponseMessage = {
        payload: message.payload,
        messageId,
      };

      socket.send(JSON.stringify(response));

      return;
    }

    const outgoingMessage: OutgoingMessage = {
      payload: message.payload,
      type: 'workspace-update',
    };

    socket.send(JSON.stringify(outgoingMessage));
  }

  /**
   * Method for connection event
   *
   * @param socket - socket
   * @param req - additional GET request from client
   */
  public static async connection(socket: ws, req: express.Request): Promise<void> {
    /**
     * Connecting client authorization token
     */
    const authToken: string | undefined = req.headers.authorization;

    /**
     * Connecting client workspaces
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

    Server.clients.add(client);

    /**
     * Incoming message handler
     */
    socket.on('message', Server.onmessage);

    /**
     * Client disconnects
     */
    socket.on('close', Server.onclose);

    /**
     * Error
     */
    socket.on('error', Server.onerror);
  }

  /**
   * Method for message event
   *
   * @param this - socket
   * @param data - message data
   * @private
   */
  private static async onmessage(this: ws, data: string): Promise<void> {
    const dataObj: IncomingMessage = JSON.parse(data);

    const payload: MessagePayload = {};

    switch (dataObj.type) {
      case 'getWorkspaces':
        payload.workspaces = await WorkspacesController.getWorkspaces();
        break;
    }

    Server.send(this, dataObj.messageId, payload);
  }

  /**
   * Method for close event
   *
   * @private
   * @param this - socket
   */
  private static onclose(this: ws): void {
    Server.clients.remove(this);
  }

  /**
   * Method for error event
   *
   * @private
   * @param this - socket
   */
  private static onerror(this: ws): void {
    Server.clients.remove(this);
  }
}
