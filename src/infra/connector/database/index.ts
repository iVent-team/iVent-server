import { DataSource } from 'typeorm';
import logger from '../../module/logger';
import env from '../../module/dotenv';

class Database {
    public source: DataSource;
    public initPromise: Promise<DataSource>;

    constructor() {
        this.init();
    }

    init() {
        this.source = new DataSource({
            driver: undefined,
            type: 'postgres',
            host: env.DB_HOST,
            port: env.DB_PORT,
            username: env.DB_USER,
            password: env.DB_PASS,
            database: env.DB_NAME,
            logging: !env.IS_PROD,
            synchronize: true,
            useUTC: true,
            entities: [
                process.cwd() + '/{src,dist}/domain/**/*.entity{.ts,.js}',
            ],
            subscribers: [
                process.cwd() + '/{src,dist}/domain/**/*.subscriber{.ts,.js}',
            ],
            poolErrorHandler: async (err: Error) => {
                logger.log(
                    logger.levelEnum.ERROR,
                    'error detected on database pool',
                    {
                        ...err,
                    },
                );
                this.init();
                await this.initPromise;
            },
        });

        this.initPromise = this.source.initialize();
    }
}

const database = new Database();

export default database;
