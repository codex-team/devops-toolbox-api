// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface ProcessEnv {
    HTTP_PORT: string,
    WS_PORT: string,
    DB_URL: string,
    CONFIG_FILE: string,
  }
}
