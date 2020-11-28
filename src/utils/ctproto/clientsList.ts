import Client from './client';

/**
 * Method for finding a client by some external logic.
 * Will be passed to the Array.find() method
 */
type ClientQueryCallback = (client: Client) => boolean;

/**
 * Connected clients manager.
 * Allows to find, send messages and so on
 *
 * Pattern: Fluent Interface
 * https://en.wikipedia.org/wiki/Fluent_interface
 */
export default class ClientsList {
  /**
   * Stores connected cliens list
   */
  private clients: Client[] = [];

  /**
   * This property will store currently found items.
   * Used for chaning via Fluent Interface:
   *
   * @example  clients.find((client) => client.socket === socket ).remove();
   */
  private cursor: Client[] | undefined;

  /**
   * Saves the new client
   *
   * @param client - client to save
   */
  public add(client: Client): ClientsList {
    this.clients.push(client);

    return this;
  }

  /**
   * Return client by query callback
   *
   * @param queryCallback - search functon
   */
  public query(queryCallback: ClientQueryCallback): ClientsList {
    this.cursor = this.clients.filter(queryCallback);

    return this;
  }

  /**
   * Return true if cursor has a value
   */
  public exists(): boolean {
    return this.cursor !== undefined && Array.isArray(this.cursor) && this.cursor.length > 0;
  }

  /**
   * Returns found items
   */
  public execute(): Client[] | undefined {
    return this.cursor;
  }

  /**
   * Returns array of found items, or empty array
   */
  public toArray(): Client[] {
    return this.cursor || [];
  }

  /**
   * Returns array of found items, or empty array
   */
  public remove(): ClientsList {
    if (!this.cursor) {
      return this;
    }

    this.cursor.forEach(client => {
      const index = this.clients.indexOf(client);

      if (index > -1) {
        this.clients.splice(index, 1);
      }
    });

    return this;
  }
}