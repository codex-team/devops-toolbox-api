import express from 'express';
import AgentController from '../controllers/agent';

const router: express.Router = express.Router();

/**
 * Put request for update services
 */
router.put('/', AgentController.updateServices);

export default router;
