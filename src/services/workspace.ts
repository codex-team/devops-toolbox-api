import mongoose from '../database';
import Workspace from '../database/models/workspace';
import IWorkspace from '../types/workspace';
import Service from '../types/service';

/**
 * Workspace service
 */
export default class WorkspacesService {
  /**
   * Find all workspaces with options
   *
   * @param workspaceOptions - Workspace options for looking for documents
   */
  public static async find(workspaceOptions: mongoose.FilterQuery<typeof Workspace> = {}): Promise<IWorkspace[] | null> {
    return Workspace.find(workspaceOptions);
  }

  /**
   * Find one workspace by token
   *
   * @param userToken - Workspace options for looking for documents
   */
  public static async findOne(userToken: string | undefined): Promise<IWorkspace | null> {
    return Workspace.findOne({ authToken: userToken });
  }

  /**
   * Update server services
   *
   * @param token - Server token
   * @param actualServices - Actual services
   */
  public static async updateServices(token: string | undefined, actualServices: Service[]): Promise<IWorkspace | null> {
    return Workspace.findOneAndUpdate({ 'servers.token': token }, {
      $set: {
        'servers.$.services': actualServices,
      },
      new: true,
    });
  }
}
