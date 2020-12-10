import { Workspace } from '../..';
import { ResponseMessage } from '../../../utils/ctproto/types';

/**
 * What kind of data will be send as the response for 'get-workspaces' request
 */
export interface GetWorkspacesResponsePayload {
  /**
   * Workspaces of the user
   */
  workspaces: Workspace[]
}

/**
 * Describes the response of the getting user workspaces request
 */
export default interface GetWorkspacesResponse extends ResponseMessage<GetWorkspacesResponsePayload> {
}
