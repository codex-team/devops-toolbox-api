import mongoose from '..';
import ServiceStatus from '../../types/serviceStatus';

/**
 * Project status Schema
 */
const serverServicesStatusesSchema: mongoose.Schema = new mongoose.Schema({
  /**
   * Workspace servers' services' statuses
   */
  serverToken: {
    type: String,
    required: true,
  },
  services: [ {
    name: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
    },
  } ],
});

export default mongoose.model<ServiceStatus>('service_statuses', serverServicesStatusesSchema);
