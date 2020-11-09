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
   * @returns { Promise<Workspace[] | null> }
   */
  public static async find(workspaceOptions: mongoose.FilterQuery<typeof Workspace> = {}): Promise<IWorkspace[] | null> {
    return Workspace.find(workspaceOptions);
  }

  /**
   * Add new workspace
   *
   * @param workspace - new workspace
   * @returns { Promise<IWorkspace | null> }
   */
  public static async add(workspace: mongoose.FilterQuery<typeof Workspace>): Promise<IWorkspace | null> {
    const newWorkspace = new Workspace(workspace);

    return newWorkspace.save();
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
    }, {
      new: true,
    });
  }
}
