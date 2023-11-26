import express from 'express';
import { Request, Response } from '../../infra/middleware/express';

const router = express.Router();

router.get('/', async function (req: Request, res: Response, next: Function) {
    res.custom.send(200, { status: 'ok' });
    return next();
});

export default router;
