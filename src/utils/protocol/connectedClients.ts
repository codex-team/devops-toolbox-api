import Client from './client';

type ClientQueryCallback = (client: Client) => boolean;

/**
 *
 */
export default class ConnectedClients {
  private clients: Client[] = [];

  /**
   * Saves the new client
   *
   * @param client - client to save
   */
  public add(client: Client): ConnectedClients {
    this.clients.push(client);

    return this;
  }


  /**
   * Return client by query callback
   *
   * @param queryCallback - search functon
   */
  public find(queryCallback: ClientQueryCallback): Client | undefined {
    return this.clients.find(queryCallback);
  }

  /**
   * Return true if there is a client with passed criteria
   *
   * @param queryCallback - search functon
   */
  public exists(queryCallback: ClientQueryCallback): boolean {
    return this.clients.find(queryCallback) !== undefined;
  }
}