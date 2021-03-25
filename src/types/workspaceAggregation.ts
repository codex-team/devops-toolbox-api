import Server from './server';

/**
 * Interface for server
 */
export default interface WorkspaceAggregation {
  /**
   * ID of workspace
   */
  _id: string;
  /**
   * Name of workspace
   */
  name: string;

  /**
   * Server of workspace
   */
  servers: Server[];
}
