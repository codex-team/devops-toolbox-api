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

export interface NginxPayload {
  listen: string,
  serverName: string,
  proxyPass: string,
}

export interface DockerPayload {
  names: string,
  containerId: string,
  image: string,
  created: Date,
  status: string,
  ports: Port[]
}

type ServicePayload =
  | NginxPayload
  | DockerPayload;

export default ServicePayload;
