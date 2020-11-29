import app from './app';
import Config from './config';
import { CTProtoServer } from './utils/ctproto/server';
import { Workspace } from './types/workspace';
import WorkspacesService from './services/workspace';
import { DevopsToolboxAuthData, DevopsToolboxAuthRequest } from './types/auth';
import { NewMessage, AuthRequestPayload } from './utils/ctproto/types';
import express from "express";
import HttpError from "./utils/httpError";

app.listen(Config.httpPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.httpPort}`);
});

const transport = new CTProtoServer({
  port: Config.wsPort,
  path: '/client',
  async onAuth(authRequestPayload: AuthRequestPayload): Promise<DevopsToolboxAuthData> {
    /**
     * Connected client's authorization token
     */
    const authToken: string = (authRequestPayload as DevopsToolboxAuthRequest).token.toString();

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

  async onMessage(message: NewMessage): Promise<void | object> {
    /**
     * @todo add handlers
     */
    switch (message.type) {

    }

    return Promise.resolve();
  },
});

/**
 * Save transport to locals
 * That allows using it in controllers
 * @example req.app.locals.transport
 */
app.locals.transport = transport;
