import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import {
    initTransactionMiddleware,
    notFoundMiddleware,
    transactionStartLoggingMiddleware,
    transactionEndLoggingMiddleware,
} from './infra/middleware/handler';

import router from './service';
import * as path from 'path';

const app: Express = express();

app.disable('x-powered-by');

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);
app.use(bodyParser.json({ limit: 1024 * 1024 * 30 }) as RequestHandler);

app.use(cookieParser() as RequestHandler);

app.use(
    '/images',
    express.static(path.join(process.cwd(), 'images'), {
        extensions: ['png'],
    }),
);

app.set('etag', false);

app.use('/api/v0', initTransactionMiddleware);
app.use('/api/v0', transactionStartLoggingMiddleware);
app.use('/api/v0', router);
app.use('/api/v0', notFoundMiddleware);
app.use('/api/v0', transactionEndLoggingMiddleware);

export default app;
