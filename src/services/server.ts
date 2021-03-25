import mongoose from '../database';
import ServerProjectsStatuses from '../types/serverProjectsStatuses';
import IServerProjectsStatuses from '../database/models/serverServicesStatuses';

/**
 * Server of workspace with token,services and projects
 */
export default class Server {
  /**
   * Add new server
   *
   * @param server - new server
   */
  public static async add(server: ServerProjectsStatuses): Promise<ServerProjectsStatuses | null> {
    const newServer = new IServerProjectsStatuses(server);

    return newServer.save();
  }

  /**
   * Update of server projects' statuses in DB
   *
   * @param serverProjectsStatuses - server projects' statuses and server token
   */
  public static async updateServicesStatuses(serverProjectsStatuses: ServerProjectsStatuses): Promise<mongoose.Document> {
    const server = await IServerProjectsStatuses.findOne({ serverToken: serverProjectsStatuses.serverToken });

    if (!server) {
      await this.add(serverProjectsStatuses);
    }

    return IServerProjectsStatuses.updateOne({
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
