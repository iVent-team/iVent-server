import express from 'express';
import {
    validateAccessToken,
    validateManager,
} from '../../infra/middleware/handler/security';
import * as ManagerService from './manager.service';
import { requestWrapper } from '../../infra/middleware/handler/requestWrapper';

const router = express.Router();

router.get(
    '/user/individual/pending',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.getPendingIndividual),
);

router.post(
    '/user/individual/pending/:id',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.approvePendingIndividual),
);

router.get(
    '/user/organization/pending',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.getPendingOrganization),
);

router.post(
    '/user/organization/pending/:id',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.approvePendingOrganization),
);

router.delete(
    '/user/:id',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.deleteUser),
);

router.get(
    '/ivent/pending',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.getPendingIvent),
);

router.post(
    '/ivent/pending/:id',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.approvePendingIvent),
);

router.delete(
    '/ivent/:id',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.deleteIvent),
);

export default router;
