import Workspace from './workspace';

/**
 * Interface for service
 */
interface ConfigData {
  /**
   * Array of all workspaces from config-file
   */
  workspaces: Workspace[];
}

export default ConfigData;
