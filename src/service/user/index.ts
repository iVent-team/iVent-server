import express from 'express';
import { validateAccessToken } from '../../infra/middleware/handler';
import multer from 'multer';
import path from 'path';
import { ulid } from 'ulid';
import { requestWrapper } from '../../infra/middleware/handler/requestWrapper';
import * as UserService from './user.service';

const router = express.Router();

router.post('/sign', requestWrapper(UserService.signUp));

router.put('/sign', requestWrapper(UserService.signIn));

router.get('/sign', requestWrapper(UserService.refresh));

router.delete('/sign', requestWrapper(UserService.signOut));

router.get('/', validateAccessToken, requestWrapper(UserService.getMyInfo));

router.delete('/', validateAccessToken, requestWrapper(UserService.withdraw));

router.put(
    '/image',
    validateAccessToken,
    multer({
        storage: multer.diskStorage({
            destination: function (req, file, done) {
                return done(null, 'images/user/');
            },
            filename: function (req, file, done) {
                const ext = path.extname(file.originalname);
                if (-1 !== ['.png', '.PNG'].indexOf(ext)) {
                    return done(null, ulid() + ext);
                } else {
                    return done(null, 'filtered-' + ulid());
                }
            },
        }),
        limits: { fileSize: 32 * 1024 * 1024 }, // 32MB
    }).single('img'),
    requestWrapper(UserService.updateImage),
);

router.put(
    '/password',
    validateAccessToken,
    requestWrapper(UserService.updatePassword),
);

export default router;
