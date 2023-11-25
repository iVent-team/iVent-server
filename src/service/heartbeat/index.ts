import express from 'express';
import { Request, Response } from '../../infra/middleware/express';

const router = express.Router();

router.get('/', async function (req: Request, res: Response, next: Function) {
    res.status(200).custom.send({ status: 'ok' });
    return next();
});

export default router;
