import Client from './client';


type ClientQueryCallback = (client: Client) => boolean;

/**
 *
 */
export default class ConnectedClients {
  private clients: Client[] = [];

  public add(client: Client): ConnectedClients {
    this.clients.push(client);

    return this;
  }

  public find(queryCallback: ClientQueryCallback): ConnectedClients {
    this.clients.find(queryCallback);

    return this;
  }
}