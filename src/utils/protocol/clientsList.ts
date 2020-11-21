import { Client } from './types';
import ws from 'ws';

/**
 * ClientsList class for info about connected clients
 */
class ClientsList {
  /**
   * Field for a single instance of a class
   */
  private static instance: ClientsList;
  /**
   *
   * Connected clients
   */
  private clients: Client[] = [];

  /**
   * Get all clients
   *
   */
  public static getAll(): ClientsList {
    if (!this.instance) {
      this.instance = new ClientsList();
    }

    return this.instance;
  }

  /**
   * Add client
   *
   * @param client - Client
   */
  public add(client: Client): void {
    this.clients.push(client);
  }

  /**
   * Remove client
   *
   * @param clientSocket - Client socket
   */
  public remove(clientSocket: ws): void {
    this.clients = this.clients.filter(client => client.socket != clientSocket);
  }

  /**
   * Find client
   *
   * @param workspaceId - Client workspace
   */
  public find(workspaceId: string): Client[] | undefined {
    return this.clients.filter(client => client.workspaceIds?.find(id => id == workspaceId));
  }
}

export default ClientsList;
