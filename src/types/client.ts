import ws from 'ws';

/**
 * Interface for client (which client has which workspaces)
 */
interface Client {
  /**
   * Client socket
   */
  socket: ws;
  /**
   * Client workspaces
   */
  workspaces: string[];
}

export default Client;
