import mongoose from '..';
import { Workspace } from '../../types';

/**
 * Workspace Schema
 */
const workspaceSchema: mongoose.Schema = new mongoose.Schema({
  /**
   * Workspace name
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * User personal token to identify the owner of the workspace
   */
  authToken: {
    type: String,
    required: true,
  },
  /**
   * Workspace servers
   */
  servers: [ {
    /**
     * Server name
     */
    name: {
      type: String,
      required: true,
    },
    /**
     * Server token
     */
    token: String,
    /**
     * Server services
     */
    services: [ {
      /**
       * Service type (nginx, docker, ports, interfaces, disk)
       */
      type: { type: String },
      /**
       * Service payload
       */
      payload: mongoose.Schema.Types.Mixed,
    } ],
  } ],
});

export default mongoose.model<Workspace>('Workspace', workspaceSchema);
