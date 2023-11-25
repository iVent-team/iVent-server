import { Request, Response } from '../express';
import logger, { TransactionLogger } from '../../module/logger';

const initTransactionMiddleware = async (
    req: Request,
    res: Response,
    next: Function,
) => {
    req.custom = {
        logger: new TransactionLogger(logger, 'HTTP'),
    };
    res.custom = {
        send: (s: number, c: {}) => {
            if (!res.destroyed && undefined === res.custom.responseJson) {
                try {
                    res.custom.responseJson = c;
                    return res.status(s).json(c).send();
                } catch (e) {
                    req.custom.logger.log(
                        req.custom.logger.levelEnum.WARN,
                        'cannot write response',
                        {
                            path: req.get('host') + req.originalUrl,
                            method: req.method,
                            c: c,
                            responseJson: res.custom.responseJson,
                            message: e.message,
                        },
                    );
                }
            } else {
                req.custom.logger.log(
                    req.custom.logger.levelEnum.WARN,
                    'cannot rewrite response',
                    {
                        path: req.get('host') + req.originalUrl,
                        method: req.method,
                        c: c,
                        responseJson: res.custom.responseJson,
                    },
                );
            }
        },
        responseJson: undefined,
    };
    res.setHeader('transaction-id', req.custom.logger.uuid);

    next();
};

export { initTransactionMiddleware };
