import mongoose from '..';
import ServiceStatus from '../../types/serviceStatus';

/**
 * Project status Schema
 */
const serverServicesStatusesSchema: mongoose.Schema = new mongoose.Schema({
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
  services: [ {
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

export default mongoose.model<ServiceStatus>('service_statuses', serverServicesStatusesSchema);
