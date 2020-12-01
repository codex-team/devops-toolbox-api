import express from 'express';
import WorkspacesService from '../services/workspace';
import { Workspace } from '../types';
import Client from '../utils/ctproto/client';
import { DevopsToolboxAuthData } from '../types/auth';
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
    const workspace: Workspace | null = await WorkspacesService.updateServices(req.headers.authorization, req.body.services);

    if (workspace) {
      req.app.locals.transport
        .clients
        .find((client: Client<DevopsToolboxAuthData>) => client.authData.workspaceIds.includes(workspace._id))
        .send('workspace-updated', { workspace });
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
