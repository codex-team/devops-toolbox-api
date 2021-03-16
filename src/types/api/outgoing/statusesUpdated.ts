import ServiceStatus from './../../serviceStatus';
import { NewMessage } from 'ctproto/types';

/**
 * Data about the updated statuses
 */
interface StatusesUpdatedPayload {
  /**
   * The updated workspace
   */
  statuses: ServiceStatus;
}

/**
 * Describes the outgoing message that will be sent when statuses of services will be updated
 */
export default interface StatusesUpdatedMessage extends NewMessage<StatusesUpdatedPayload> {
  type: 'statuses-updated';
}
