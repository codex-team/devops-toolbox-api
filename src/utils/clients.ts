import Client from '../types/client';
import ws from 'ws';

/**
 * Clients class
 */
class Clients {
  private clients: { [key: string]: ws};

  /**
   * Constructor
   */
  constructor() {
    this.clients = {};
  }

  /**
   * Add client
   *
   * @param client - Client
   */
  public add(client: Client): void {
    this.clients[client.authToken] = client.socket;
  }

  /**
   * Remove client
   *
   * @param authToken - Client authorization token
   */
  public remove(authToken: string): void {
    delete this.clients[authToken];
  }

  /**
   * Find client
   *
   * @param authToken - Client authorization token
   */
  public find(authToken: string): ws {
    return this.clients[authToken];
  }
}

export default Clients;
