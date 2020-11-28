import { Workspace } from './workspace';

/**
 *
 */
export default interface ConfigData {
  /**
   * Array of all workspaces from config-file
   */
  workspaces: Workspace[];
}