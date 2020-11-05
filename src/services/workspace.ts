import mongoose from '../database';
import Workspace from '../database/models/workspace';
import IWorkspace from '../types/workspace';

/**
 * Workspace service
 */
export default class WorkspacesService {
  /**
   * Find workspaces by received data
   *
   * @param workspaceOptions - Workspace options for looking for documents
   */
  public static async find(workspaceOptions: mongoose.FilterQuery<typeof Workspace> = {}): Promise<IWorkspace[] | null> {
    return Workspace.find(workspaceOptions);
  }
}
