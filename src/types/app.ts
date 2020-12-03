import { CTProtoServer } from '../utils/ctproto/server';
import { ApiRequest, ApiResponse, ApiOutgoingMessage } from './api';
import { AuthorizeMessagePayload } from './api/requests/authorize';
import { DevopsToolboxAuthData } from './api/responses/authorize';

/**
 * Describes app.locals structure
 */
interface AppLocals extends Record<string, unknown>{
  /**
   * CTProto server instance that is available in all controllers
   */
  transport: CTProtoServer<AuthorizeMessagePayload, DevopsToolboxAuthData, ApiRequest, ApiResponse, ApiOutgoingMessage>

  /**
   * Authenticated user data
   */
  user: DevopsToolboxAuthData;
}

/**
 * express.Application with modified 'locals' property
 *
 * @see https://expressjs.com/en/api.html#app.locals
 */
interface TunedExpressApplication {
  /**
   * Useful data accessible through all the application
   * Restricted by the single Request context
   */
  locals: AppLocals;
}

/**
 * Override the 'express' type to specify type for the modified app.locals
 */
declare module 'express' {
  interface Request {
    app: TunedExpressApplication;
  }
}
