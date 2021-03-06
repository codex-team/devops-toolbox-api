import GetWorkspaces from './requests/getWorkspaces';
import Authorize from './requests/authorize';
import AuthorizeResponse from './responses/authorize';
import GetWorkspacesResponse from './responses/getWorkspaces';
import WorkspaceUpdatedMessage from './outgoing/workspaceUpdated';

/**
 * This file uses Discriminating Unions types for our API
 *
 * @see https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions
 */

/**
 * The type described all available API request messages
 */
export type ApiRequest =
  | Authorize
  | GetWorkspaces
;

/**
 * The type described all available API response messages
 */
export type ApiResponse =
  | AuthorizeResponse
  | GetWorkspacesResponse
;

/**
 * The type described all available outgoing messages that can be sent by API
 */
export type ApiOutgoingMessage =
  | WorkspaceUpdatedMessage
;
