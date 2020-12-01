import Service from './service';

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
   * List of services running on the server
   */
  services: Service[];
}
