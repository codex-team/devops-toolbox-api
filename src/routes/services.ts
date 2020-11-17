import express from 'express';
import AgentController from '../controllers/agent';

const router: express.Router = express.Router();

/**
 * PUT request for update services
 */
router.put('/', AgentController.updateServices);

export default router;
