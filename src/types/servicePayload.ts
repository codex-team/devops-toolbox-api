/**
 * Information about connection that is used in docker
 */
export interface Port {
  inner: {
    host: string,
    port: string,
    type: string,
  },
  outer: {
    host: string,
    port: string,
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
