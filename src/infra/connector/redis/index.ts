import * as redis from 'redis';
import env from '../../module/dotenv';
import logger from '../../module/logger';

const redisClient = redis.createClient({
    url: `redis://@${env.REDIS_HOST}:${env.REDIS_PORT}`,
    readonly: false,
});

redisClient.on('connect', () =>
    logger.log(logger.levelEnum.INFO, 'redis connected'),
);
redisClient.on('error', err =>
    logger.log(logger.levelEnum.ERROR, 'redis error', { stack: err.stack }),
);

export default redisClient;
