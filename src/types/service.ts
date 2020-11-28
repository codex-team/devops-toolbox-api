/**
 * Service is the working software we are watching for
 * for example, Nginx or Docker
 */
export default interface Service {
  /**
   * What kind of serice represented by a payload
   * Examples: 'nginx', 'docker' etc
   */
  type: string;

  /**
   * Usefull data about the service
   * collected by Agent
   */
  payload: object | object[];
};
