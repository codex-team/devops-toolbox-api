import * as mongoose from 'mongoose';

/**
 * Services of the server
 */
export interface Projects {
  /**
   * Name of service
   */
  name: string;
  /**
   * State of service (online/offline)
   */
  isOnline: boolean;
}
/**
 * Status of service in workspace
 */
export default interface ServiceStatus extends mongoose.Document {
  /**
   * Server's (containing the services) id
   */
  serverToken: string;
  /**
   * Services of the server
   */
  services: Projects[];
}
