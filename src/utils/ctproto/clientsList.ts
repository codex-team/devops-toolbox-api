import Client from './client';
import { MessagePayload } from './types';
import MessageFactory from './messageFactory';
import { CloseEventCode } from './closeEvent';

/**
 * Method for finding a client by some external logic.
 * Will be passed to the Array.find() method
 */
type ClientQueryCallback<AuthData> = (client: Client<AuthData>, index: number, array: Client<AuthData>[]) => boolean;

/**
 * Connected clients manager.
 * Allows to find, send messages and so on
 *
 * Pattern: Fluent Interface
 * https://en.wikipedia.org/wiki/Fluent_interface
 *
 * @template AuthData - structure described authorized client data
 */
export default class ClientsList<AuthData> {
  /**
   * Stores connected clients list
   */
  private clients: Client<AuthData>[] = [];

  /**
   * This property will store currently found items.
   * Used for chaining via Fluent Interface:
   *
   * @example  clients.find((client) => client.socket === socket ).remove();
   */
  private cursor: Client<AuthData>[] | undefined;

  /**
   * Saves the new client
   *
   * @param client - client to save
   */
  public add(client: Client<AuthData>): ClientsList<AuthData> {
    this.clients.push(client);

    return this;
  }

  /**
   * Return client by find callback
   *
   * @param queryCallback - search function
   */
  public find(queryCallback: ClientQueryCallback<AuthData>): ClientsList<AuthData> {
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
  public execute(): Client<AuthData>[] | undefined {
    return this.cursor;
  }

  /**
   * Returns array of found items, or empty array
   */
  public toArray(): Client<AuthData>[] {
    return this.cursor || [];
  }

  /**
   * Returns array of found items, or empty array
   */
  public remove(): ClientsList<AuthData> {
    if (!this.cursor) {
      return this;
    }

    /**
     * Close connections before removing
     */
    this.close();

    this.cursor.forEach(client => {
      const index = this.clients.indexOf(client);

      if (index > -1) {
        this.clients.splice(index, 1);
      }
    });

    return this;
  }

  /**
   * Sends a message to the found clients
   *
   * @param type - message action type
   * @param payload - data to send
   */
  public send(type: string, payload: MessagePayload): ClientsList<AuthData> {
    if (!this.cursor) {
      return this;
    }

    this.cursor.forEach(client => {
      client.socket.send(MessageFactory.create(type, payload));
    });

    return this;
  }

  /**
   * Closes connection of selected clients
   *
   * @param code - close event code
   */
  public close(code = CloseEventCode.NormalClosure): ClientsList<AuthData> {
    if (!this.cursor) {
      return this;
    }

    this.cursor.forEach(client => {
      client.socket.close(code);
    });

    return this;
  }
}
