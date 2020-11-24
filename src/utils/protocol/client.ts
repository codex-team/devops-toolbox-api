import ws from 'ws';

/**
 * Represents the connected client 
 */
export default class Client {

  public authData: object = {};
  public socketId = '';
  public socket: ws;
  
  constructor(socket, authData){
    this.socket = socket;
    this.authData = authData;
  }
}