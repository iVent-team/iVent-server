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

router.delete(
    '/user/individual/pending',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.deletePendingUser),
);

router.post(
    '/user/individual/pending',
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

router.delete(
    '/user/organization/pending',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.deletePendingUser),
);

router.post(
    '/user/organization/pending',
    validateAccessToken,
    validateManager,
    requestWrapper(ManagerService.approvePendingOrganization),
);

export default router;
