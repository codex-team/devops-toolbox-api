import app from './../app';
import axios from 'axios';
import WorkspacesService from './../services/workspace';
import ServiceStatus from './../types/serviceStatus';
import IWorkspace from './../types/workspace';

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
        await WorkspacesService.findOne({ _id: workspace._id })
          .then(async (ws) => {
            await WorkspacesService.aggregateServices(
              [
                {
                  $match: {
                    _id: ws?._id,
                  },
                }, {
                  $group: {
                    _id: null,
                    servicesList: {
                      $push: '$servers.services.payload.serverName',
                    },
                  },
                },
              ]
            )
              .then((servicesAggregation) => {
                this.checkingServicesAvailability(servicesAggregation[0].servicesList.flat(Infinity))
                  .then((statuses) => {
                    this.sendStatuses(statuses, user);
                  });
              });
          });
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

      await axios.get(axiosReq)
        .then((axiosRes) => {
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
