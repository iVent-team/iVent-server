#!/usr/bin/env node

import http from 'http';
import type createError from 'http-errors';
import fs from 'fs';

import './global';

import logger from './infra/module/logger';
import app from './app';
import env from './infra/module/dotenv';

import database from './infra/connector/database';
import redisClient from './infra/connector/redis';

Error.stackTraceLimit = Infinity;

(async () => {
    try {
        fs.readdirSync('images');
    } catch (error) {
        console.error('initialize images directory');
        fs.mkdirSync('images');
    }
    try {
        fs.readdirSync('images/store');
    } catch (error) {
        console.error('initialize store image directory');
        fs.mkdirSync('images/store');
    }
    try {
        fs.readdirSync('images/user');
    } catch (error) {
        console.error('initialize user image directory');
        fs.mkdirSync('images/user');
    }

    await redisClient.connect();
    fs.readdir(process.cwd(), (err: never, fileList: string[]) => {
        logger.log(logger.levelEnum.INFO, 'service started', {
            path: process.cwd(),
            dir: fileList,
        });
    });

    await database.initPromise;

    const port = env.HTTP_PORT;
    app.set('port', port);

    const server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    process.on('uncaughtException', onUncaughtException);

    function onError(error: createError.HttpError): void {
        const bind = 'Port ' + String(port);

        switch (error.code) {
            case 'EACCES':
                logger.log(
                    logger.levelEnum.ERROR,
                    'requires elevated privileges',
                    {
                        bind,
                    },
                );
                throw error as Error;
            case 'EADDRINUSE':
                logger.log(logger.levelEnum.ERROR, 'bind is already in use', {
                    bind,
                });
                throw error as Error;
            default:
                throw error;
        }
    }

    function onListening(): void {
        const addr = server.address();
        const bind =
            typeof port === 'string'
                ? 'Pipe ' + String(addr)
                : 'Port ' + String(port);
        logger.log(logger.levelEnum.INFO, 'Listening on bind', { bind });
    }

    function onUncaughtException(err: Error): void {
        logger.log(logger.levelEnum.ERROR, 'Error occurred', {
            message: err.message,
        });
        return;
    }
})();
