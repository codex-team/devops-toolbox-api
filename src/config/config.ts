import dotenv from 'dotenv';

dotenv.config();

/**
 * Class for settings (data from .env and etc)
 */
class Config {
  /**
   * The Port you are using for http connection
   */
  public static httpPort: number = +process.env.HTTP_PORT!;
  /**
   * The Port you are using for web socket connection
   */
  public static wsPort: number = +process.env.WS_PORT!;
}

export default Config;
