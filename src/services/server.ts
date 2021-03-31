import mongoose from '../database';
import IServerProjectsStatuses from '../types/serverProjectsStatuses';
import ServerProjectsStatuses from '../database/models/serverServicesStatuses';

/**
 * Server of workspace with token,services and projects
 */
export default class Server {
  /**
   * Add new server
   *
   * @param server - new server
   */
  public static async add(server: IServerProjectsStatuses): Promise<IServerProjectsStatuses | null> {
    const newServer = new ServerProjectsStatuses(server);

    return newServer.save();
  }

  /**
   * Update of server projects' statuses in DB
   *
   * @param serverProjectsStatuses - server projects' statuses and server token
   */
  public static async updateServicesStatuses(serverProjectsStatuses: IServerProjectsStatuses): Promise<mongoose.Document> {
    const server = await ServerProjectsStatuses.findOne({ serverToken: serverProjectsStatuses.serverToken });

    if (!server) {
      await this.add(serverProjectsStatuses);
    }

    return ServerProjectsStatuses.updateOne({
      serverToken: serverProjectsStatuses.serverToken,
    }, {
      $set: {
        projectsStatuses: serverProjectsStatuses.projectsStatuses,
      },

    }, {
      new: true,
    });
  }
}
