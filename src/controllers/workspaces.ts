import WorkspacesService from '../services/workspace';
import mongoose from 'mongoose';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   */
  public static async getWorkspaces(): Promise<mongoose.Document | null> {
    return WorkspacesService.find({});
  }
}
