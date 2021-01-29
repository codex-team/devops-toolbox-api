/**
 * Information for SSH connection to server
 */
export default interface SSHConnectionInfo {
  /**
   * Server ip address
   */
  ip: string;

  /**
   * Username
   */
  username: string;

  /**
   * If the server has a special port for ssh connection
   */
  port?: string;
}
