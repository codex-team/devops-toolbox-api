import WorkspacesService from '../services/workspace';
import Workspace from '../types/workspace';
import express from 'express';

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
   * Add workspace
   *
   * @param req - request
   * @param res - response
   */
  public static async addWorkspace(req: express.Request, res: express.Response): Promise<void> {
    const workspace = {
      name: req.body.name,
      authToken: req.body.authToken,
      servers: req.body.servers,
    };

    const workspaceDocument: Workspace | null = await WorkspacesService.add(workspace);

    res.json({
      workspaceDocument,
    });
  }
}
