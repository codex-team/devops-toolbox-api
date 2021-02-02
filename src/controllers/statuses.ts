import app from './../app';
import axios from 'axios';
import WorkspacesService from './../services/workspace';
import ServiceStatus from './../types/serviceStatus';
import IWorkspace from './../types/workspace';
import Client from 'ctproto/build/src/server/client';
import { DevopsToolboxAuthData } from '../types/api/responses/authorize';
import { ApiOutgoingMessage, ApiResponse } from '../types';

/**
 * Statuses controller
 */
export default class StatusesController {
  /**
   * Update statuses and send to logged users
   */
  public static async updateStatuses(): Promise<void> {
    const users = app.context.transport.clients.toArray();

    for (const user of users) {
      const workspaces: IWorkspace[] = user.authData.workspaces;

      for (const workspace of workspaces) {
        const ws = await WorkspacesService.findOne({ _id: workspace._id });

        if (ws) {
          const servicesAggregation = await WorkspacesService.aggregateServices(ws._id);
          const statuses = await this.checkingServicesAvailability(servicesAggregation[0].servicesList.flat(Infinity));

          this.sendStatuses(statuses, user);
        }
      }
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
      const axiosReq = 'https://' + service;

      const axiosRes = await axios.get(axiosReq);

      if (axiosRes.statusText === 'OK') {
        statuses.push({
          name: service,
          isOnline: true,
        });
      } else {
        statuses.push({
          name: service,
          isOnline: false,
        });
      }
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
