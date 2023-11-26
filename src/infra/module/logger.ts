import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { randomUUID } from 'crypto';

import env from './dotenv';

enum logLevelEnum {
    ERROR,
    WARN,
    INFO,
    DEBUG,
    HTTP,
    SILLY,
}

class Logger {
    public readonly levelEnum = logLevelEnum;
    private readonly logger: winston.Logger;

    constructor() {
        const logDir = 'logs';
        const loggerFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
        );

        this.logger = winston.createLogger({
            format: loggerFormat,
            transports: [
                new winstonDaily({
                    level: 'silly',
                    datePattern: 'YYYY-MM-DD',
                    dirname: logDir,
                    filename: '%DATE%.log',
                    maxFiles: 30,
                    zippedArchive: true,
                }),
                new winstonDaily({
                    level: 'error',
                    datePattern: 'YYYY-MM-DD',
                    dirname: logDir + '/error',
                    filename: '%DATE%.error.log',
                    maxFiles: 30,
                    zippedArchive: true,
                }),
                new winston.transports.Console({
                    format: loggerFormat,
                    level: env.IS_PROD ? 'http' : 'silly',
                    handleExceptions: true,
                    handleRejections: true,
                    debugStdout: true,
                    eol: '\n',
                }),
            ],
        });
    }

    public log(
        level: logLevelEnum,
        message: string,
        data?: { [index: string]: object | string | number },
    ) {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                let stringValue: string;
                try {
                    stringValue =
                        typeof value === 'object'
                            ? JSON.stringify(value, undefined, '')
                            : String(value);
                } catch (e) {
                    stringValue = `fail to stringify ${typeof value}`;
                }
                message += ` | ${key}=${stringValue}`;
            });
        }
        message = message.replace(/\n/g, '\\n');

        switch (level) {
            case logLevelEnum.ERROR:
                this.logger.error(message);
                break;
            case logLevelEnum.WARN:
                this.logger.warn(message);
                break;
            case logLevelEnum.INFO:
                this.logger.info(message);
                break;
            case logLevelEnum.DEBUG:
                this.logger.debug(message);
                break;
            case logLevelEnum.HTTP:
                this.logger.http(message);
                break;
            case logLevelEnum.SILLY:
                this.logger.silly(message);
                break;
            default:
                this.log(logLevelEnum.ERROR, 'unexpected log level', { level });
                this.log(logLevelEnum.WARN, message);
                break;
        }
        return;
    }
}

class TransactionLogger {
    public readonly levelEnum;
    public readonly uuid: string;
    private readonly logger: Logger;
    private privLogJob?: Promise<void> = undefined;
    private readonly header: string;

    constructor(logger: Logger, header = '') {
        this.logger = logger;
        this.levelEnum = logger.levelEnum;
        this.uuid = randomUUID();
        this.header = '' === header ? '' : header + ':';
    }

    private async logJob(
        level: logLevelEnum,
        message: string,
        data?: { [index: string]: object | string | number },
    ) {
        await this.logger.log(level, `[${this.uuid}] ${message}`, data);
    }

    public log(level: logLevelEnum, message: string, data?: {}) {
        if (this.privLogJob instanceof Promise)
            this.privLogJob.then(() => {
                this.privLogJob = this.logJob(
                    level,
                    this.header + message,
                    data,
                );
            });
        else this.privLogJob = this.logJob(level, this.header + message, data);
        return;
    }

    public async end() {
        await Promise.all([this.privLogJob]);
        return;
    }
}

const logger = new Logger();

export { Logger, TransactionLogger };
export default logger;
