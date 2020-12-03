import WorkspacesService from '../services/workspace';
import { GetWorkspacesPayload } from '../types/api/requests/get-workspaces';
import { GetWorkspacesResponsePayload } from '../types/api/responses/get-workspaces';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   *
   * @param message - request data
   */
  public static async getWorkspaces(message: GetWorkspacesPayload): Promise<GetWorkspacesResponsePayload> {
    console.log('getWorkspaces request payload: ', message);
    const workspaces = await WorkspacesService.find({ authToken: '' });

    return {
      workspaces: workspaces || [],
    };
  }
}
