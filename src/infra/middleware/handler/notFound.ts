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
            res.status(404).custom.jsonSend({
                status: 'fail',
                message: '요청 대상을 찾을 수 없습니다',
            });
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
