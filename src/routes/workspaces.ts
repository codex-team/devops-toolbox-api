import express from 'express';
import WorkspacesController from '../controllers/workspaces';

const router: express.Router = express.Router();

/**
 * POST request for add workspaces
 */
router.post('/', WorkspacesController.addWorkspace);

export default router;
