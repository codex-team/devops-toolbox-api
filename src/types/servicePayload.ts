/**
 * Information about connection that is used in docker
 */
export interface Port {
  /**
   * Port for inside container
   */
  inner: {
    /**
     * Host for inside container
     */
    host: string,
    /**
     * Port for inside container
     */
    port: string,
    /**
     * Type of  inside container
     */
    type: string,
  },
  /**
   * Port for outside container
   */
  outer: {
    /**
     * Host for outside container
     */
    host: string,
    /**
     * Port for outside container
     */
    port: string,
    /**
     * Type for outside container
     */
    type: string,
  }
}

/**
 * Useful data about the nginx service
 * collected by Agent
 */
export interface NginxPayload {
  listen: string,
  serverName: string,
  proxyPass: string,
}
/**
 * Useful data about the docker service
 * collected by Agent
 */
export interface DockerPayload {
  names: string,
  containerId: string,
  image: string,
  created: Date,
  status: string,
  ports: Port[]
}

/**
 * Type is used to unite all existing payloads
 */
type ServicePayload =
  | NginxPayload
  | DockerPayload;

export default ServicePayload;
