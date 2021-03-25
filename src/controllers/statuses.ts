import ping from 'ping';
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental,@typescript-eslint/no-unused-vars
import app from './../app';
import WorkspacesService from './../services/workspace';
import ServerProjectsStatuses, { ProjectStatus } from '../types/serverProjectsStatuses';
import IWorkspace from './../types/workspace';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental
import Client from 'ctproto/build/src/server/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental
import { DevopsToolboxAuthData } from '../types/api/responses/authorize';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental
import { ApiOutgoingMessage, ApiResponse } from '../types';
import Server from '../services/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental
import WorkspaceAggregation, { Server as IServer } from '../types/workspaceAggregation';

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
        const workspaceAggregations: WorkspaceAggregation[] = await WorkspacesService.aggregateServices(workspace._id);

        /**
         * For each object with serverId and projects of the server update statuses
         */
        for (const w of workspaceAggregations) {
          for (const s of w.servers) {
            for (const service of s.services) {
            /**
             * If type of service is nginx, server's projects are pinged
             */
              if (service.type == 'nginx') {
                const projectsStatuses = await this.pingProjects(service.payload);
                const serverProjectsStatuses: ServerProjectsStatuses = {
                  projectsStatuses,
                  serverToken: s.token,
                } as ServerProjectsStatuses;

                await Server.updateServicesStatuses(serverProjectsStatuses);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Project availability check
   *
   * @param serverProject - array of workspace server's projects
   */
  public static async checkProjectAvailability(serverProject:string): Promise<ProjectStatus> {
    if (serverProject === '') {
      return {
        host: 'Unnamed host',
        isOnline: false,
      };
    } else {
      const pingServer = await ping.promise.probe(serverProject);

      return {
        host: serverProject,
        isOnline: pingServer.alive,
      };
    }
  }

  /**
   * Ping projects of some server
   *
   * @param projectList - list of project of payload of some service of some server
   */
  public static async pingProjects(projectList: Record<string, unknown>[]): Promise<ProjectStatus[]> {
    const projectsStatuses:ProjectStatus[] = [];

    for (const project of projectList) {
      projectsStatuses.push(await StatusesController.checkProjectAvailability(project['serverName'] as string));
    }

    return projectsStatuses;
  }

  /**
   * Send statuses to clients
   *
   * @param statuses - array of statuses of all client services
   * @param user - user
   */
  // public static sendStatuses(statuses: ServerProjectsStatuses[], user: Client<DevopsToolboxAuthData, ApiResponse, ApiOutgoingMessage>): void {
  //   if (typeof user.authData.userToken === 'string') {
  //     app.context.transport
  //       .clients
  //       .find((client) => client.authData.userToken === user.authData.userToken)
  //       .send('statuses-updated', { statuses });
  //   }
  // }
}
