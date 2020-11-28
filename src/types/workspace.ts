import mongoose from '../database';
import Server from './server';

/**
 * Interface for workspace
 */
export interface Workspace extends mongoose.Document {
  /**
   * Workspace name
   */
  name: string;

  /**
   * User personal token to identify the owner of the workspace
   */
  authToken: string;

  /**
   * Workspace servers
   */
  servers: Server[];
}