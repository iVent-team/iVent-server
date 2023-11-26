import { Request, Response } from '../express';

const requestWrapper = (handler: Function) => {
    return async (req: Request, res: Response, next: Function) => {
        try {
            const body = await handler(req, res, next);
            const status = !body ? 204 : 200;
            res.custom.send(status, body);
        } catch (err: any) {
            const status = err.status || 400;
            res.custom.send(status, {
                message: err.message.toString().split(': ')[1]
                    ? err.message.toString().split(': ')[1]
                    : err.message.toString(),
            });
        }
        return next();
    };
};

export { requestWrapper };
