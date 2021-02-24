/**
 * Update server services' statuses
 *
 * @param serviceStatus - array of services' names and statuses
 */
import IServiceStatus from '../types/serviceStatus';
import mongoose from '../database';
import ServiceStatus from '../database/models/serverServicesStatuses';

/**
 * Server service
 */
export default class ServerService {
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
   * @param serviceStatus - services' statuses and server token
   */
  public static async updateServicesStatuses(serviceStatus: IServiceStatus): Promise<mongoose.Document> {
    if (!(await ServiceStatus.findOne({ serverToken: serviceStatus.serverToken }))) {
      await this.add(serviceStatus);
    }

    return ServiceStatus.updateOne({
      serverToken: serviceStatus.id,
    }, {
      $set: {
        services: serviceStatus.services,
      },

    }, {
      new: true,
    });
  }
}
