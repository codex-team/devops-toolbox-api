/**
 * Status of service in workspace
 */
import * as mongoose from 'mongoose';

export default interface ServiceStatus {
  /**
   * Name of service
   */
  name: string;

  /**
   * State of service (online/offline)
   */
  isOnline: boolean;

  _id: mongoose.Types.ObjectId;
}
