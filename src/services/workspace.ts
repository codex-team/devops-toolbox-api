import Workspace from '../models/workspace';
import mongoose from 'mongoose';

/**
 * Workspace service
 */
export default class WorkspacesService {
  /**
   * @param {object} workspaceOptions - Workspace options for looking for documents
   * @returns {Promise<mongoose.Document | null} - Promise
   */
  public static async find(workspaceOptions: object): Promise<mongoose.Document | null> {
    return Workspace.findOne(workspaceOptions);
  }
}
