import WorkspacesService from '../services/workspace';
import { GetWorkspacesPayload } from '../types/api/requests/getWorkspaces';
import { GetWorkspacesResponsePayload } from '../types/api/responses/getWorkspaces';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   *
   * @param _message - request data
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async getWorkspaces(_message: GetWorkspacesPayload): Promise<GetWorkspacesResponsePayload> {
    const workspaces = await WorkspacesService.find({ authToken: '' });

    return {
      workspaces: workspaces || [],
    };
  }
}
