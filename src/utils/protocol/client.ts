import ws from 'ws';
import { AuthData } from './types/auth';

/**
 * Represents the connected client
 */
export default class Client {
  /**
   * Store 'ws' socket of a client.
   * Allows us to send him messages or break the connection
   */
  public socket: ws;

  /**
   * Stores app-related auth data returned by 'onAuth' callback
   */
  public authData: object = {};

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