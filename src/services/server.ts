import IServiceStatus from '../types/serverProjectsStatuses';
import mongoose from '../database';
import ServiceStatus from '../database/models/serverServicesStatuses';

/**
 * Server of workspace with token,services and projects
 */
export default class Server {
  /**
   * Add new server
   *
   * @param server - new server
   */
  public static async add(server: IServiceStatus): Promise<IServiceStatus | null> {
    const newServer = new ServiceStatus(server);

    return newServer.save();
  }

  /**
   * Update of services' statuses in DB
   *
   * @param serviceStatuses - services' statuses and server token
   */
  public static async updateServicesStatuses(serviceStatuses: IServiceStatus): Promise<mongoose.Document> {
    const server = await ServiceStatus.findOne({ serverToken: serviceStatuses.serverToken });

    if (!server) {
      await this.add(serviceStatuses);
    }

    return ServiceStatus.updateOne({
      serverToken: serviceStatuses.serverToken,
    }, {
      $set: {
        projectsStatuses: serviceStatuses.projectsStatuses,
      },

    }, {
      new: true,
    });
  }
}
