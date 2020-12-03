import express from 'express';
import WorkspacesService from '../services/workspace';
import { Workspace, ApiResponse, ApiOutgoingMessage } from '../types';
import { DevopsToolboxAuthData } from '../types/api/responses/authorize';
import Client from '../utils/ctproto/client';

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
        .find((client: Client<DevopsToolboxAuthData, ApiResponse, ApiOutgoingMessage>) => client.authData.workspaceIds.includes(workspace._id))
        .send('workspace-updated', { workspace });
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
