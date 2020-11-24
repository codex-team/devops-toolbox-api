import app from './app';
import Config from './config';
import { Transport, AuthData } from './utils/protocol/transport';
import ws from 'ws';
import Workspace from './types/workspace';
import { IncomingMessage } from './utils/protocol/types';
import WorkspacesService from './services/workspace';

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

interface DevopsToolboxAuthRequest {
  token: string;
}
interface DevopsToolboxAuthData extends AuthData {
  workspaceIds: string[];
  userId?: string;
}

const transport: Transport = new Transport({
  port: Config.wsPort,
  // path: '/config',
  async onAuth(authRequestPayload): Promise<DevopsToolboxAuthData> {
    /**
     * Connected client's authorization token
     */
    const authToken: string = authRequestPayload.token.toString();

    /**
     * Connected client's workspaces list
     */
    const workspaces = await WorkspacesService.find({ authToken });

    if (!workspaces?.length) {
      throw new Error('User has no workspace');
    }

    return {
      workspaceIds: workspaces.map((w: Workspace) => w.id),
    };
  },

  async onMessage(message: IncomingMessage): Promise<void> {
    switch (message.type) {

    }

    return Promise.resolve();
  },
});