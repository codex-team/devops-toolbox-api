import express from 'express';
import WorkspacesService from '../services/workspace';
import Client from '../types/client';
import Clients from '../utils/clients';

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
    const workspace = await WorkspacesService.updateServices(req.headers.authorization, req.body.services);

    if (workspace) {
      const clients: Client[] | undefined = Clients.getClients().find(workspace._id.toString());

      clients?.forEach(client => client.socket.send(JSON.stringify(workspace)));
    }

    res.json({
      success: !!workspace,
      workspace,
    });
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

    const workspaceDocument = await WorkspacesService.add(workspace);

    res.json({
      workspaceDocument,
    });
  }
}
