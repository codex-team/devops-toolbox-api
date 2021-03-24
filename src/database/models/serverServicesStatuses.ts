import mongoose from '..';
import ServerProjectsStatuses from '../../types/serverProjectsStatuses';

/**
 * Project status Schema
 */
const serverProjectsStatusesSchema: mongoose.Schema = new mongoose.Schema({
  /**
   * Workspace server's token
   */
  serverToken: {
    type: String,
    required: true,
  },
  /**
   * Workspace server's projects' names and statuses
   */
  projectsStatuses: [ {
    /**
     * Host name
     */
    host: {
      type: String,
      required: true,
    },
    /**
     * host status
     */
    isOnline: {
      type: Boolean,
      required: true,
    },
  } ],
});

export default mongoose.model<ServerProjectsStatuses>('server_projects_statuses', serverProjectsStatusesSchema);
