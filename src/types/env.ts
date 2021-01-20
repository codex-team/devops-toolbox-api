// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * Host for listening by server
     */
    HOST: string,

    /**
     * Application HTTP port (for REST API)
     */
    HTTP_PORT: string,

    /**
     * Application WebSocket port (for CTProto API)
     */
    WS_PORT: string,

    /**
     * Mongo connection string
     */
    DB_URL: string,

    /**
     * Config file path
     */
    CONFIG_FILE: string,
  }
}
