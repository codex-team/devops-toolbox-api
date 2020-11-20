import express from 'express';
import WorkspacesService from '../services/workspace';
import ClientsList from '../utils/clientsList';
import Transport from '../utils/protocol/transport';
import { Workspace, Client } from '../types';
import MessageCreator from '../utils/protocol/messageCreator';

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

      clients?.forEach(client => Transport.send(client.socket, MessageCreator.create(
        'workspace-update',
        null,
        {
          workspace,
        })));
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
