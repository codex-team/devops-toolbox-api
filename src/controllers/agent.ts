import express from 'express';
import WorkspacesService from '../services/workspace';

/**
 * Agent controller
 */
export default class AgentController {
  /**
   * Update server services
   *
   * @param req - request
   * @param res - response
   * @returns res - response
   */
  public static async update(req: express.Request, res: express.Response): Promise<express.Response> {
    const workspace = await WorkspacesService.updateServices(req.headers.authorization, req.body.services);

    return res.json({
      message: 'Updated',
      workspace,
    });
  }
}
