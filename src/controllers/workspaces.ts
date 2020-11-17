import WorkspacesService from '../services/workspace';
import Workspace from '../types/workspace';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   *
   * @param userToken - User personal token to identify the owner of the workspace
   */
  public static async getWorkspaces(userToken: string | undefined): Promise<Workspace [] | null> {
    return WorkspacesService.find({ authToken: userToken });
  }
}
