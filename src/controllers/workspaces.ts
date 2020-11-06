import WorkspacesService from '../services/workspace';
import { IWorkspace } from '../types/workspace';

/**
 * Workspace controller
 */
export default class WorkspacesController {
  /**
   * Get all workspaces
   */
  public static async getWorkspaces(): Promise<IWorkspace [] | null> {
    return WorkspacesService.find();
  }
}
