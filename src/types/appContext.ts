import type { CTProtoServer } from '../utils/ctproto/server';
import type { ApiRequest, ApiResponse, ApiOutgoingMessage } from './api';
import type { AuthorizeMessagePayload } from './api/requests/authorize';
import type { DevopsToolboxAuthData } from './api/responses/authorize';

/**
 * Describes app.context structure
 */
export default interface AppContext {
  /**
   * CTProto server instance that is available in all controllers
   */
  transport: CTProtoServer<AuthorizeMessagePayload, DevopsToolboxAuthData, ApiRequest, ApiResponse, ApiOutgoingMessage>
}
