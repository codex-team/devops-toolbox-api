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
   */
  public static async updateServices(req: express.Request, res: express.Response): Promise<void> {
    const workspace = await WorkspacesService.updateServices(req.headers.authorization, req.body.services);

    res.json({
      success: !!workspace,
      workspace,
    });
  }
}
