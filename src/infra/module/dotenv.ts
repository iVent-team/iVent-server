import { config } from 'dotenv';

class Env {
    public readonly TZ: string;

    public readonly SERVER_NAME: string;

    public readonly HTTP_PORT: number;

    public readonly DB_USER: string;
    public readonly DB_PASS: string;
    public readonly DB_HOST: string;
    public readonly DB_PORT: number;
    public readonly DB_NAME: string;

    public readonly REDIS_HOST: string;
    public readonly REDIS_PORT: number;

    public readonly JWT_KEY_TTL: number;
    public readonly JWT_ISSUER: string;
    public readonly ACCESS_TTL: number;
    public readonly REFRESH_TTL: number;

    public readonly NICE_SECRET_KEY: string;
    public readonly NICE_CLIENT_KEY: string;

    public readonly ALIGO_KEY: string;
    public readonly ALIGO_ID: string;
    public readonly ALIGO_SENDER: string;

    public readonly IS_PROD: boolean;

    constructor() {
        config();

        this.TZ = process.env.TZ ?? 'GMT0BST';

        this.SERVER_NAME = String(process.env.SERVER_NAME ?? 'UNKNOWN');

        this.HTTP_PORT = parseInt(String(process.env.HTTP_PORT), 10) ?? 3000;

        this.DB_USER = process.env.DB_USER ?? '';
        this.DB_PASS = process.env.DB_PASS ?? '';
        this.DB_HOST = process.env.DB_HOST ?? '';
        this.DB_PORT = parseInt(String(process.env.DB_PORT), 10) ?? 5432;
        this.DB_NAME = process.env.DB_NAME ?? '';

        this.REDIS_HOST = process.env.REDIS_HOST ?? '';
        this.REDIS_PORT = parseInt(String(process.env.REDIS_PORT), 10) ?? 6379;

        this.JWT_KEY_TTL = parseInt(String(process.env.JWT_KEY_TTL), 10) ?? 0;
        this.JWT_ISSUER = String(process.env.ACCESS_TTL);
        this.ACCESS_TTL = parseInt(String(process.env.ACCESS_TTL), 10) ?? 0;
        this.REFRESH_TTL = parseInt(String(process.env.REFRESH_TTL), 10) ?? 0;

        this.NICE_CLIENT_KEY = String(process.env.NICE_CLIENT_KEY);
        this.NICE_SECRET_KEY = String(process.env.NICE_SECRET_KEY);

        this.ALIGO_KEY = String(process.env.ALIGO_KEY);
        this.ALIGO_ID = String(process.env.ALIGO_ID);
        this.ALIGO_SENDER = String(process.env.ALIGO_SENDER);

        this.IS_PROD = String(process.env.IS_PROD) === 'T';
    }
}

const env = new Env();

export default env;
