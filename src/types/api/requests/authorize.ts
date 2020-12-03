import { NewMessage } from '../../../utils/ctproto/types';

/**
 * Format of data for requesting user workspaces
 */
export interface AuthorizeMessagePayload {
  /**
   * Client Auth Token
   */
  token: string;
}

/**
 * Describes the API Request for getting user workspaces
 */
export default interface AuthorizeMessage extends NewMessage<AuthorizeMessagePayload> {
  type: 'authorize';
}
