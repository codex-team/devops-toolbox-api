import { Workspace } from './workspace';

/**
 * App config (config.yml) structure
 */
export default interface ConfigData {
  /**
   * Array of all workspaces from config-file
   */
  workspaces: Workspace[];
}
