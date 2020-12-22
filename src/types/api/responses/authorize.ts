import { ResponseMessage } from 'ctproto/types';

/**
 * This data will be saved (and returned to client)
 * after successful authorization
 */
export interface DevopsToolboxAuthData {
  /**
   * Owned workspaces ids
   */
  workspaceIds: string[];

  /**
   * Current user auth token
   */
  userToken?: string;
}

/**
 * Describes the response of the getting user workspaces request
 */
export default interface AuthorizeResponseResponse extends ResponseMessage<DevopsToolboxAuthData> {
}
