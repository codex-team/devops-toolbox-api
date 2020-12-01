import { AuthData } from '../utils/ctproto/types/auth';

/**
 * Data used for authorization
 */
export interface DevopsToolboxAuthRequest {
  /**
   * Client Auth Token
   */
  token: string;
}

/**
 * This data will be saved (and returned to client)
 * after successful authorization
 */
export interface DevopsToolboxAuthData extends AuthData {
  /**
   * Owned workspaces ids
   */
  workspaceIds: string[];

  /**
   * Current user id
   */
  userId?: string;
}
