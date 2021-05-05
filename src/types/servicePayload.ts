/**
 * Port for inside/outside container
 */
export interface ContainerPort {
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
}

/**
 * Information about connection that is used in docker
 */
export interface Port {
  /**
   * Port for inside container
   */
  inner: ContainerPort,
  /**
   * Port for outside container
   */
  outer: ContainerPort,
}

/**
 * Useful data about the nginx service
 * collected by Agent
 */
export interface NginxPayload {
  /**
   * Port to listen
   */
  listen: string,
  /**
   * Name of the server
   */
  serverName: string,
  /**
   * Protocol and address of a proxied server
   */
  proxyPass: string,
}
/**
 * Useful data about the docker service
 * collected by Agent
 */
export interface DockerPayload {
  /**
   * Name of container
   */
  names: string,
  /**
   * Id of container
   */
  containerId: string,
  /**
   * Image name
   */
  image: string,
  /**
   * Date of creation
   */
  created: Date,
  /**
   * Current status
   */
  status: string,
  /**
   * Ports to connect
   */
  ports: Port[]
}

/**
 * Type is used to unite all existing payloads
 */
type ServicePayload =
  | NginxPayload
  | DockerPayload;

export default ServicePayload;
