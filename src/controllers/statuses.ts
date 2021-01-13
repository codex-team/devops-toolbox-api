import app from './../app';
import axios from 'axios';
import WorkspacesService from './../services/workspace';
import ServiceStatus from './../types/serviceStatus';

/**
 * Statuses controller
 */
export default class StatusesController {
  /**
   * Update statuses and send to logged users
   */
  public static async updateStatuses(): Promise<void> {
    console.log("i'm here");
    const users = app.context.transport.clients.toArray();
    let statuses: ServiceStatus[];

    for (const user of users) {
      const workspaces = user.authData.workspaceIds;

      statuses = [];
      for (const workspace of workspaces) {
        const ws = await WorkspacesService.find({ _id: workspace });

        if (ws) {
          const servers = ws[0].servers;

          for (const server of servers) {
            for (const service of server.services) {
              const payloads = service.payload;

              for (const payload of payloads) {
                await axios.get(payload.serverName as string)
                  .then((axiosRes) => {
                    if (axiosRes.statusText === 'OK') {
                      statuses.push({
                        name: payload.serverName as string,
                        isOnline: true,
                      });
                    } else {
                      statuses.push({
                        name: payload.serverName as string,
                        isOnline: true,
                      });
                    }
                  });
              }
            }
          }
        }
      }

      if (typeof user.authData.userToken === 'string') {
        app.context.transport
          .clients
          .find((client) => client.authData.userToken === user.authData.userToken)
          .send('statuses-updated', { statuses });
      }
    }
  }
}
