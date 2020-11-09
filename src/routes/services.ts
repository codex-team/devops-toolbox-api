import express from 'express';
import AgentController from '../controllers/agent';

const router: express.Router = express.Router();

/**
 * PUT request for update services
 */
router.put('/', AgentController.updateServices);

/**
 * POST request for add workspaces
 */
router.post('/', AgentController.addWorkspace);

export default router;
