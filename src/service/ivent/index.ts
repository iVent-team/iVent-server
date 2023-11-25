import express from 'express';
import {
    validateAccessToken,
    validateActivated,
} from '../../infra/middleware/handler/security';
import * as IventService from './ivent.service';
import { requestWrapper } from '../../infra/middleware/handler/requestWrapper';

const router = express.Router();

router.post(
    '/',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.postIvent),
);

router.get(
    '/',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.getIventList),
);

router.get(
    '/detail/:id',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.getIventDetail),
);

export default router;
