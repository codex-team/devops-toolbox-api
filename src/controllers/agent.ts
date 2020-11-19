import express from 'express';
import WorkspacesService from '../services/workspace';
import ClientsList from '../utils/clientsList';
import Server from '../utils/server';
import { Workspace, Client } from '../types';

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
      const clients: Client[] | undefined = ClientsList.getClients().find(workspace._id.toString());

      clients?.forEach(client => Server.send(client.socket, null, { workspace }));
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
