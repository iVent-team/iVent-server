import { Request, Response } from '../express';

const notFoundMiddleware = async (
    req: Request,
    res: Response,
    next: Function,
) => {
    if (!res.destroyed && undefined === res.custom.responseJson) {
        try {
            req.custom.logger.log(
                req.custom.logger.levelEnum.INFO,
                'not founded',
            );
            res.custom.send(404, undefined);
        } catch (e) {
            req.custom.logger.log(
                req.custom.logger.levelEnum.WARN,
                'cannot return 404',
            );
        }
    }

    next();
};

export { notFoundMiddleware };
