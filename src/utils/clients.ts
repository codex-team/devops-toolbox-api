import Client from '../types/client';
import ws from 'ws';

/**
 * Clients class for info about connected clients
 */
class Clients {
  /**
   * Field for a single instance of a class
   */
  private static singleTone: Clients;
  /**
   *
   * Connected clients
   */
  private clients: Client[] = [];

  /**
   * Get all clients
   *
   */
  public static getClients(): Clients {
    if (!this.singleTone) {
      this.singleTone = new Clients();
    }

    return this.singleTone;
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
    return this.clients.filter(client => client.workspaces.find(workspace => workspace == workspaceId));
  }
}

export default Clients;
