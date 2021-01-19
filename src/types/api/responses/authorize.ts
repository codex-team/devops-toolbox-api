import { ResponseMessage } from 'ctproto/types';
import Workspace from '../../workspace';

/**
 * This data will be saved (and returned to client)
 * after successful authorization
 */
export interface DevopsToolboxAuthData {
  /**
   * Owned workspaces
   */
  workspaces: Workspace[];

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
