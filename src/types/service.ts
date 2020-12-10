/**
 * Service is the working software we are watching for
 * for example, nginx or Docker
 */
export default interface Service {
  /**
   * What kind of service represented by a payload
   * Examples: 'nginx', 'docker' etc
   */
  type: string;

  /**
   * Useful data about the service
   * collected by Agent
   */
  payload: Record<string, unknown>;
}
