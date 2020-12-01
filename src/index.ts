import app from './app';
import Config from './config';
import { CTProtoServer } from './utils/ctproto/server';
import { Workspace } from './types';
import WorkspacesService from './services/workspace';
import { DevopsToolboxAuthData, DevopsToolboxAuthRequest } from './types/auth';
import { NewMessage } from './utils/ctproto/types';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});


interface GetWorkspacesPayload {
  workspace: string;
}

interface SaveUserPayload {
  user: string;
}

type APIPayloads = SaveUserPayload | GetWorkspacesPayload;


const transport = new CTProtoServer({
  port: Config.wsPort,
  async onAuth(authRequestPayload: DevopsToolboxAuthRequest): Promise<DevopsToolboxAuthData> {
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

    return {
      workspaceIds: workspaces.map((w: Workspace) => w.id),
    };
  },

  async onMessage(message: NewMessage<APIPayloads>): Promise<void | Record<string, unknown>> {
    /**
     * @todo add handlers
     */
    switch (message.type) {

    }

    message.payload



    return Promise.resolve();
  },
});

/**
 * Save transport to locals
 * That allows using it in controllers
 *
 * @example req.app.locals.transport
 */
app.locals.transport = transport;
