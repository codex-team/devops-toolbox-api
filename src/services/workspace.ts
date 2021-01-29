import mongoose from '../database';
import Workspace from '../database/models/workspace';
import { Workspace as IWorkspace, Service } from '../types';
import ServicesAggregation from '../types/servicesAggregation';

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
   * Find one workspace with options
   *
   * @param workspaceOptions - Workspace options for looking for documents
   */
  public static async findOne(workspaceOptions: mongoose.FilterQuery<typeof Workspace> = {}): Promise<IWorkspace | null> {
    return Workspace.findOne(workspaceOptions);
  }

  /**
   * Aggregate workspaces by different pipelines
   *
   * @param pipeline - condition for selection workspaces
   */
  public static async aggregateServices(pipeline: any): Promise<ServicesAggregation[]> {
    return Workspace.aggregate(pipeline);
  }

  /**
   * Add new workspace
   *
   * @param workspace - new workspace
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
