import express from 'express';

import heartbeatRouter from './heartbeat';
import manageRouter from './manage';
import userRouter from './user';

const router = express.Router();

router.use('/heartbeat', heartbeatRouter);
router.use('/manage', manageRouter);
router.use('/user', userRouter);

export default router;
