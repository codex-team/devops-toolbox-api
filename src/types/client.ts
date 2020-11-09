import ws from 'ws';

/**
 * Interface for client
 */
interface Client {
  /**
   * Client socket
   */
  socket: ws;
  /**
   * Client authorization token
   */
  authToken: string;
}

export default Client;
