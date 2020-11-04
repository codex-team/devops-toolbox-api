import Workspace from '../database/models/workspace';
import IWorkspace from '../types/workspace';

/**
 * Workspace service
 */
export default class WorkspacesService {
  /**
   * @param {object} workspaceOptions - Workspace options for looking for documents
   * @returns {Promise<mongoose.Document | null} - Promise
   */
  public static async find(workspaceOptions: object = {}): Promise<IWorkspace[] | null> {
    return Workspace.find(workspaceOptions);
  }
}
