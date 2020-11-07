import WorkspacesService from '../services/workspace';
import Workspace from '../types/workspace';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   */
  public static async getWorkspaces(): Promise<Workspace [] | null> {
    return WorkspacesService.find();
  }

  /**
   * Get one workspace by user token
   *
   * @param userToken - User personal token to identify the owner of the workspace
   */
  public static async getWorkspace(userToken: string | undefined): Promise<Workspace | null> {
    return WorkspacesService.findOne(userToken);
  }
}
