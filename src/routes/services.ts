import express from 'express';
import AgentController from '../controllers/agent';

const router: express.Router = express.Router();

router.put('/', AgentController.update);

export default router;
