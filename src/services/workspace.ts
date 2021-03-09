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
   * @param id - id of aggregating workspace
   */
  public static async aggregateServices(id: mongoose.Types.ObjectId): Promise<ServicesAggregation[]> {
    return Workspace.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $unwind: '$servers',
      },
      {
        $group: {
          _id: '$servers.token',
          servicesList: {
            $push: {
              serviceType: '$servers.services.type',
              projectName: '$servers.services.payload.serverName',
            },
          },
        },
      },
    ]);
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
