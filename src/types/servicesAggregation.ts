import SSHConnectionInfo from './SSHConnectionInfo';
import Service from './service';

/**
 * Interface for server
 */
export interface Server {
  /**
   * Server name
   */
  name: string;

  /**
   * Integration token
   * given on server creation
   */
  token: string;

  /**
   * Information for SSH connection to server
   */
  sshConnectionInfo: SSHConnectionInfo;

  /**
   * List of services running on the server
   */
  services: Service;
}
/**
 * Interface for server
 */
export default interface ServicesAggregation {
  /**
   * ID of aggregation
   */
  _id: string;
  /**
   * Name of workspace
   */
  name: string;
  /**
   * Authtoken of workspace
   */
  authToken: string;

  /**
   * Server of workspace
   */
  servers: Server;
}
