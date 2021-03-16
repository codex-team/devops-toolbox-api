import * as mongoose from 'mongoose';

/**
 * Services of the server
 */
export interface Projects {
  /**
   * Name of service
   */
  host: string;
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
   * Projects of the server
   */
  projects: Projects[];
}
