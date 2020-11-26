import ws from 'ws';
import { AuthData } from './types/auth';

/**
 * Represents the connected client
 */
export default class Client {
  public authData: object = {};
  public socket: ws;

  constructor(socket: ws, authData: AuthData) {
    this.socket = socket;
    this.authData = authData;
  }
}