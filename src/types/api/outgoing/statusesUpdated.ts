import { NewMessage } from 'ctproto/types';
import ServerProjectsStatuses from '../../serverProjectsStatuses';

/**
 * Data about the updated statuses
 */
interface StatusesUpdatedPayload {
  /**
   * The updated workspace
   */
  projectsStatuses: ServerProjectsStatuses;
}

/**
 * Describes the outgoing message that will be sent when statuses of services will be updated
 */
export default interface StatusesUpdatedMessage extends NewMessage<StatusesUpdatedPayload> {
  type: 'statuses-updated';
}
