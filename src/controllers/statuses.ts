import ping from 'ping';
import app from './../app';
import WorkspacesService from './../services/workspace';
import ServiceStatus from './../types/serviceStatus';
import IWorkspace from './../types/workspace';
import Client from 'ctproto/build/src/server/client';
import { DevopsToolboxAuthData } from '../types/api/responses/authorize';
import { ApiOutgoingMessage, ApiResponse } from '../types';
import mongoose from '../database';

/**
 * Statuses controller
 */
export default class StatusesController {
  /**
   * Update statuses and send to logged users
   */
  public static async updateStatuses(): Promise<void> {
    const users = app.context.transport.clients.find(client => !!client).toArray();

    for (const user of users) {
      const workspaces: IWorkspace[] = user.authData.workspaces;

      for (const workspace of workspaces) {
        const ws = await WorkspacesService.findOne({ _id: workspace._id });

        if (ws) {
          const servers = await WorkspacesService.aggregateServices(ws._id);

          // console.log(servers);
          // console.log(servers[0].servicesList[0].projectName[0]);

          for (const server of servers) {
            const services = server.servicesList[0].projectName[0].flat(Infinity);
            const statuses = await this.checkingServicesAvailability(services, server.servicesList[0]._id[0]);

            // console.log(statuses);
            await WorkspacesService.updateServicesStatuses(server._id, statuses);
          }
          // console.log(servicesAggregation[0].servicesList[0].serverToken);
          // console.log(statuses);
          // this.sendStatuses(statuses, user);
        }
      }
    }
  }

  /**
   * Service availability check
   *
   * @param services - array of workspace services
   * @param id - service id
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static async checkingServicesAvailability(services:string[], id:mongoose.Types.ObjectId): Promise<ServiceStatus[]> {
    const statuses: ServiceStatus[] = [];

    for (const service of services) {
      const pingService = await ping.promise.probe(service);

      statuses.push({
        name: service,
        isOnline: pingService.alive,
        _id: id,
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
  public static sendStatuses(statuses: ServiceStatus[], user: Client<DevopsToolboxAuthData, ApiResponse, ApiOutgoingMessage>): void {
    if (typeof user.authData.userToken === 'string') {
      app.context.transport
        .clients
        .find((client) => client.authData.userToken === user.authData.userToken)
        .send('statuses-updated', { statuses });
    }
  }
}
