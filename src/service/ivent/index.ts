import express from 'express';
import {
    validateAccessToken,
    validateActivated,
    validateIndividual,
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

router.post(
    '/join/:id',
    validateAccessToken,
    validateIndividual,
    validateActivated,
    requestWrapper(IventService.joinIvent),
);

router.get(
    '/pending/:id',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.getPendingAttendees),
);

router.post(
    '/pending/:id/:attendanceId',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.approvePendingAttendees),
);

router.delete(
    '/pending/:id/:attendanceId',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.deleteAttendance),
);

router.get(
    '/attendance/:id',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.getAttendance),
);

router.delete(
    '/attendance/:id/:attendanceId',
    validateAccessToken,
    validateActivated,
    requestWrapper(IventService.deleteAttendance),
);

export default router;
