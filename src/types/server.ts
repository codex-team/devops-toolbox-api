import { Service } from './service';

/**
 * Interface for server
 */
export interface Server {
  /**
   * Server name
   */
  name: string;
  /**
   * Server token
   */
  token: string;
  /**
   * Server services
   */
  services: Service[];
}
