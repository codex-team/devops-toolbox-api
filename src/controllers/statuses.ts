import app from './../app';
import axios from 'axios';
import mongoose from 'mongoose';
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
    const users = app.context.transport.clients.toArray();
    const services: string[] = [];

    for (const user of users) {
      const workspaces: string[] = user.authData.workspaceIds;

      for (const workspace of workspaces) {
        const workspaceId = mongoose.Types.ObjectId(workspace);
        const ws = await WorkspacesService.findOne({ _id: workspaceId });

        if (ws) {
          const servers = ws.servers;

          for (const server of servers) {
            for (const service of server.services) {
              const payloads = service.payload;

              for (const payload of payloads) {
                services.push(payload.serverName as string);
              }
            }
          }
        }
      }
      this.checkingServicesAvailability(services)
        .then((statuses) => {
          this.sendStatuses(statuses, user);
        });
    }
  }

  /**
   * Service availability check
   *
   * @param services - array of workspace services
   */
  public static async checkingServicesAvailability(services: string[]): Promise<ServiceStatus[]> {
    const statuses: ServiceStatus[] = [];

    for (const service of services) {
      await axios.get(service)
        .then((axiosRes) => {
          if (axiosRes.statusText === 'OK') {
            statuses.push({
              name: service,
              isOnline: true,
            });
          } else {
            statuses.push({
              name: service,
              isOnline: true,
            });
          }
        });
    }

    return statuses;
  }

  /**
   * Send statuses to clients
   *
   * @param statuses - array of statuses of all client services
   * @param user - user
   */
  public static sendStatuses(statuses: ServiceStatus[], user: any): void {
    if (typeof user.authData.userToken === 'string') {
      app.context.transport
        .clients
        .find((client) => client.authData.userToken === user.authData.userToken)
        .send('statuses-updated', { statuses });
    }
  }
}
