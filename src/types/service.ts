import { DockerPayload, NginxPayload } from './servicePayload';

/**
 * Service is the working software we are watching for
 * for example, nginx or Docker
 */

export default interface Service<ServicePayload> {
  /**
   * What kind of service represented by a payload
   * Examples: 'nginx', 'docker' etc
   */
  type: string;

  /**
   * Useful data about the service
   * collected by Agent
   */
  payload: ServicePayload[];
}

/**
 * Service for case when we are working with nginx
 */
export interface NginxService extends Service<NginxPayload> {
  type: 'nginx';
}
/**
 * Service for case when we are working with docker
 */
export interface DockerService extends Service<DockerPayload> {
  type: 'docker';
}
