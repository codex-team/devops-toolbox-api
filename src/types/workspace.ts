import mongoose from '../database';

/**
 * Interface for typing Workspace
 */
export interface Workspace extends mongoose.Document {
  /**
   * Workspace name
   */
  name: string;
  /**
   * Workspace servers
   */
  servers: {
    /**
     * Server name
     */
    name: string;
    /**
     * Server token
     */
    token: string;
    /**
     * Server services
     */
    services: {
      /**
       * Service type
       */
      type: string;
      /**
       * Service payload
       */
      payload: object | object[];
    }[];
  }[];
}

export default Workspace;
