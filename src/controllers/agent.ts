import express from 'express';
import WorkspacesService from '../services/workspace';
import ClientsList from '../utils/protocol/clientsList';
import Transport from '../utils/protocol/transport';
import { Workspace } from '../types';
import { Client } from '../utils/protocol/types';
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
      const clients: Client[] | undefined = ClientsList.getAll().find(workspace._id.toString());

      clients?.forEach(client => Transport.send(client, 'workspace-update', { workspace }));
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
