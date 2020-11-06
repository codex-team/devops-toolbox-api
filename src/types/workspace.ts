import mongoose from '../database';
import { Server } from './server';

/**
 * Interface for workspace
 */
export interface IWorkspace extends mongoose.Document {
  /**
   * Workspace name
   */
  name: string;
  /**
   * Workspace servers
   */
  servers: Server[];
}
