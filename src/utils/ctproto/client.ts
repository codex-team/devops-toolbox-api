import ws from 'ws';

/**
 * Represents the connected client
 *
 * @template AuthData - structure described authorized client data
 */
export default class Client<AuthData> {
  /**
   * Store 'ws' socket of a client.
   * Allows us to send him messages or break the connection
   */
  public socket: ws;

  /**
   * Stores app-related auth data returned by 'onAuth' callback
   */
  public authData: AuthData;

  /**
   * Create a new client
   *
   * @param socket - 'ws' socket connected
   * @param authData - app-related data returned by 'onAuth' callback
   */
  constructor(socket: ws, authData: AuthData) {
    this.socket = socket;
    this.authData = authData;
  }
}
