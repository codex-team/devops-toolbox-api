import express from 'express';
import WorkspacesService from '../services/workspace';
import Client from '../types/client';
import ClientsList from '../utils/clientsList';
import Workspace from '../types/workspace';
import Response from '../types/response';

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

      const wsResponse: Response = {
        messageId: null,
        type: 'updateServices',
        payload: {
          updatedWorkspace: workspace,
        },
      };

      clients?.forEach(client => client.socket.send(JSON.stringify(wsResponse)));
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
