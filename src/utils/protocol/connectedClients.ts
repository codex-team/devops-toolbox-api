import Client from './client';

/**
 * Method for finding a client by some external logic.
 * Will be passed to the Array.find() method
 */
type ClientQueryCallback = (client: Client) => boolean;

/**
 * Connected clients manager.
 * Allows to find, send messages and so on
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