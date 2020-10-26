import dotenv from 'dotenv';

dotenv.config();
/**
 * Class for settings (data from .env and etc)
 */
class Config {
    /**
     * The Port you are using
     */
    public static http_port: number = +process.env.HTTP_PORT!;
    public static ws_port: number = +process.env.WS_PORT!;


}

export default Config;
