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
 * Statuses controller to work with updating/checking/sending statuses of servers' statuses for each workspace
 */
export default class StatusesController {
  /**
   * Update statuses and send to logged users
   */
  public static async updateStatuses(): Promise<void> {
    const workspaces: IWorkspace[] | null = await WorkspacesService.find({});

    /**
     * If workspaces exist,then updating statuses for them
     */
    if (workspaces) {
      for (const workspace of workspaces) {
        /**
         * Get workspace servers and their projects
         */
        const workspaceAggregations = await WorkspacesService.aggregateServices(workspace._id);

        /**
         * For each object with serverId and projects of the server update statuses
         */
        for (const workspaceAggregation of workspaceAggregations) {
          const serverServicesStatuses: ServiceStatus = {} as ServiceStatus;
          const serviceList = workspaceAggregation.servicesList[0].projectName.flat(Infinity);
          const serviceStatuses = await this.checkingServicesAvailability(serviceList);

          serverServicesStatuses.serverToken = workspaceAggregation._id;
          serverServicesStatuses.services = serviceStatuses;
          await ServerService.updateServicesStatuses(serverServicesStatuses);
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
