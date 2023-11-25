import express from 'express';
import { Request, Response } from '../../infra/middleware/express';
import {
    validateAccessToken,
    validateManager,
} from '../../infra/middleware/handler/security';

const router = express.Router();

router.get(
    '/',
    validateAccessToken,
    validateManager,
    async function (req: Request, res: Response, next: Function) {
        res.status(200).custom.jsonSend({ status: 'ok' });
        return next();
    },
);

export default router;
