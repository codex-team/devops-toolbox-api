import WorkspacesService from '../services/workspace';
import { Workspace } from '../types';

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
}
