// eslint-disable-next-line
/// <reference path="./types/app.d.ts" />
import app from './app';
import Config from './config';
import { CTProtoServer } from './utils/ctproto/server';
import { Workspace, WorkspacesController, ApiRequest, ApiResponse, ApiOutgoingMessage } from './types';
import WorkspacesService from './services/workspace';
import { AuthorizeMessagePayload } from './types/api/requests/authorize';
import { DevopsToolboxAuthData } from './types/api/responses/authorize';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

/**
 * Initialize CTProto server for API
 */
const transport = new CTProtoServer<AuthorizeMessagePayload, DevopsToolboxAuthData, ApiRequest, ApiResponse, ApiOutgoingMessage>({
  port: Config.wsPort,
  async onAuth(authRequestPayload: AuthorizeMessagePayload): Promise<DevopsToolboxAuthData> {
    /**
     * Connected client's authorization token
     */
    const authToken = authRequestPayload.token.toString();

    /**
     * Connected client's workspaces list
     */
    const workspaces = await WorkspacesService.find({ authToken });

    if (!workspaces?.length) {
      throw new Error('Wrong auth token passed');
    }

    const user = {
      workspaceIds: workspaces.map((w: Workspace) => w.id),
      userToken: authToken,
    } as DevopsToolboxAuthData;

    /**
     * @todo save user to res.locals
     */

    return user;
  },

  async onMessage(message: ApiRequest): Promise<void | ApiResponse['payload']> {
    /**
     * @todo add handlers
     */
    switch (message.type) {
      case 'get-workspaces':
        return WorkspacesController.getWorkspaces(message.payload);
    }
  },
});

/**
 * Save transport to locals
 * That allows using it in controllers
 *
 * @example req.app.locals.transport
 */
app.context = { transport };
