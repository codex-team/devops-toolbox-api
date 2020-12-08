import { NewMessage } from '../../../utils/ctproto/types';

/**
 * Format of data for requesting user workspaces
 */
export interface GetWorkspacesPayload {
  /**
   * This request has an empty payload
   */
}

/**
 * Describes the API Request for getting user workspaces
 */
export default interface GetWorkspacesMessage extends NewMessage<GetWorkspacesPayload> {
  type: 'get-workspaces';
}
