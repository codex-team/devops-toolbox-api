import Service from './service';
import SSHConnectionInfo from './SSHConnectionInfo';
import ServicePayload from './servicePayload';

/**
 * Interface for server
 */
export default interface Server {
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
  services: Service<ServicePayload>[];
}
