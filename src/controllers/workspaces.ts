import WorkspacesService from '../services/workspace';
import Workspace from '../types/workspace';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   *
   * @param userToken - User personal token to identify its token in the database
   */
  public static async getWorkspaces(): Promise<Workspace [] | null> {
    return WorkspacesService.find();
  }
}
