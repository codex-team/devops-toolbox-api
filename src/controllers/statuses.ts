import ping from 'ping';
import app from './../app';
import WorkspacesService from './../services/workspace';
import ServiceStatus, { Projects } from './../types/serviceStatus';
import IWorkspace from './../types/workspace';
import Client from 'ctproto/build/src/server/client';
import { DevopsToolboxAuthData } from '../types/api/responses/authorize';
import { ApiOutgoingMessage, ApiResponse } from '../types';
import ServerService from '../services/server';

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
          /**
           * Get workspace servers and their projects
           */
          const workspaceAggregations = await WorkspacesService.aggregateServices(ws._id);

          for (const workspaceAggregation of workspaceAggregations) {
            const serverServicesStatuses: ServiceStatus = {} as ServiceStatus;

            console.log(workspaceAggregation, '123');
            const serviceList = workspaceAggregation.servicesList[0].projectName.flat(Infinity);
            const serviceStatuses = await this.checkingServicesAvailability(serviceList);

            serverServicesStatuses.serverToken = workspaceAggregation._id;
            serverServicesStatuses.services = serviceStatuses;
            await ServerService.updateServicesStatuses(serverServicesStatuses);
          }
        }
      }
    }
  }

  /**
   * Service availability check
   *
   * @param serverProjects - array of workspace server's services
   */
  public static async checkingServicesAvailability(serverProjects:string[]): Promise<Projects[]> {
    const statuses:Projects[] = [];

    for (const serverProject of serverProjects) {
      const pingService = await ping.promise.probe(serverProject);
      console.log(pingService);
      statuses.push({
        name: serverProject,
        isOnline: pingService.alive,
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
