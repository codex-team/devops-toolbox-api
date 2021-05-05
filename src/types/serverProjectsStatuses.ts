import mongoose from 'mongoose';

/**
 * Project status of the server
 */
export interface ProjectStatus {
  /**
   * Name of host
   */
  host: string;
  /**
   * State of host (online/offline)
   */
  isOnline: boolean;
}
/**
 * Status of service in workspace
 */
export default interface ServerProjectsStatuses extends mongoose.Document {
  /**
   * Server's (containing the services) id
   */
  serverToken: string;
  /**
   * Projects with their statuses of the server
   */
  projectsStatuses: ProjectStatus[];
}
