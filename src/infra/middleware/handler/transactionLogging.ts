import { Request, Response } from '../express';

async function transactionStartLoggingMiddleware(
    req: Request,
    res: Response,
    next: Function,
): Promise<void> {
    req.custom.logger.log(
        req.custom.logger.levelEnum.HTTP,
        'transaction started',
        {
            path: req.get('host') + req.originalUrl,
            method: req.method,
            body: req.body,
            query: req.query,
            headers: req.headers,
        },
    );

    next();
}

async function transactionEndLoggingMiddleware(
    req: Request,
    res: Response,
    next: Function,
): Promise<void> {
    req.custom.logger.log(
        req.custom.logger.levelEnum.HTTP,
        'transaction ended',
        {
            status: res.statusCode,
            body: res.custom.responseJson,
            headers: res.getHeaders(),
        },
    );
    await req.custom.logger.end();

    next();
}

export { transactionStartLoggingMiddleware, transactionEndLoggingMiddleware };
