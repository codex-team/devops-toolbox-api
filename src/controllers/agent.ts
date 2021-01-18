import express from 'express';
import WorkspacesService from '../services/workspace';
import { Workspace } from '../types';

/**
 * Agent controller
 */
export default class AgentController {
  /**
   * Update server services
   *
   * @param req - request
   * @param res - response
   */
  public static async updateServices(req: express.Request, res: express.Response): Promise<void> {
    const workspace: Workspace | null = await WorkspacesService.updateServices(req.headers.authorization, req.body.payload.services);

    if (workspace) {
      req.app.context.transport
        .clients
        .find((client) => client.authData.workspaces.find(w => w._id.toString() === workspace._id.toString()) !== undefined)
        .send('workspace-updated', { workspace });
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
