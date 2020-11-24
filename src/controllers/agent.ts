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
    const workspace: Workspace | null = await WorkspacesService.updateServices(req.headers.authorization, req.body.services);

    if (workspace) {
      // const clients: Client[] | undefined = ClientsList.getAll().find(workspace._id.toString());

      // clients?.forEach(client => Transport.send(client, 'workspace-update', { workspace }));

      // req.locals.transport
      //   .clients
      //     .find((client) => client.auth.workspaceIds.includes(workspace._id) ) // should return Client class { auth : any, socket: ws , socketId: string }
      //     .send('workspace updated', { workspace });
    }

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
