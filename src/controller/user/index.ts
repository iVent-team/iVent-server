import express from 'express';
import { Request, Response } from '../../infra/middleware/express';
import { userRepository } from '../../domain';
import TokenManager from '../../infra/module/token';
import { validateAccessToken } from '../../infra/middleware/handler';
import multer from 'multer';
import path from 'path';
import { ulid } from 'ulid';
import fs from 'fs';

const router = express.Router();

// sign up
router.post(
    '/sign',
    async function (req: Request, res: Response, next: Function) {
        // const { accountName, hashedPassword } = req.body;

        // const tokenObject = await new TokenManager(
        //     user.id,
        // ).generateTokenObject();

        res.status(200).custom.jsonSend({
            status: 'ok',
            token: {
                // access: tokenObject.accessToken,
                // refresh: tokenObject.refreshToken,
            },
        });
        return next();
    },
);

// sign in
router.post(
    '/sign',
    async function (req: Request, res: Response, next: Function) {
        // const { accountName, hashedPassword } = req.body;

        // const tokenObject = await new TokenManager(
        //     user.id,
        // ).generateTokenObject();

        res.status(200).custom.jsonSend({
            status: 'ok',
            token: {
                // access: tokenObject.accessToken,
                // refresh: tokenObject.refreshToken,
            },
        });
        return next();
    },
);

// refresh
router.get(
    '/sign',
    async function (req: Request, res: Response, next: Function) {
        const { token } = req.query;

        const userIdInString = await new TokenManager().getAndDelRefreshToken(
            String(token),
        );
        if (userIdInString instanceof Error) {
            res.status(403).custom.jsonSend({
                status: 'fail',
                message: userIdInString.message,
            });
            return next();
        }

        const user = await userRepository.findOneById(
            parseInt(userIdInString, 10),
        );
        if (!user) {
            res.status(404).custom.jsonSend({
                status: 'fail',
                message: 'cannot find user information',
            });
            return next();
        }

        const tokenObject = await new TokenManager(
            parseInt(userIdInString, 10),
        ).generateTokenObject();

        res.status(200).custom.jsonSend({
            status: 'ok',
            token: {
                access: tokenObject.accessToken,
                refresh: tokenObject.refreshToken,
            },
        });
        return next();
    },
);

// sign out
router.delete(
    '/sign',
    async function (req: Request, res: Response, next: Function) {
        const { token } = req.query;

        await new TokenManager().getAndDelRefreshToken(String(token));

        res.status(204).custom.jsonSend({
            status: 'ok',
        });
        return next();
    },
);

// get user information
router.get(
    '/',
    validateAccessToken,
    async function (req: Request, res: Response, next: Function) {
        res.status(200).custom.jsonSend({
            status: 'ok',
            user: {
                id: req.custom.user.id,
                phone: req.custom.user.phone,
                email: req.custom.user.email,
                name: req.custom.user.name,
                image: req.custom.user.image,
            },
        });
        return next();
    },
);

// withdraw
router.delete(
    '/',
    validateAccessToken,
    async function (req: Request, res: Response, next: Function) {
        const { token } = req.query;

        await new TokenManager().getAndDelRefreshToken(String(token));

        await userRepository.deleteById(req.custom.user.id);

        res.status(204).custom.jsonSend({
            status: 'ok',
        });
        return next();
    },
);

// update profile image
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
    async function (req: Request, res: Response, next: Function) {
        if (!req.file || !req.file.filename) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                req.custom.logger.log(
                    req.custom.logger.levelEnum.WARN,
                    'cannot delete abnormal image(undefined) of user',
                    { message: e.message },
                );
            }
            res.status(400).custom.jsonSend({
                status: 'fail',
                message: 'fail to upload image',
            });
            return next();
        }
        if (req.file.filename.startsWith('filtered-')) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                req.custom.logger.log(
                    req.custom.logger.levelEnum.WARN,
                    'cannot delete abnormal image of user',
                    { message: e.message },
                );
            }
            res.status(400).custom.jsonSend({
                status: 'fail',
                message: 'unsupported format',
            });
            return next();
        }

        if ('' !== req.custom.user.image) {
            try {
                fs.unlinkSync(req.custom.user.image);
            } catch (e) {
                req.custom.logger.log(
                    req.custom.logger.levelEnum.WARN,
                    'cannot delete old image of user',
                    { message: e.message },
                );
            }
        }

        req.custom.user.image = req.file.path;
        await userRepository.save(req.custom.user);

        res.status(200).custom.jsonSend({ status: 'ok' });
        return next();
    },
);

// update name
router.put(
    '/name',
    validateAccessToken,
    async function (req: Request, res: Response, next: Function) {
        const { name } = req.body;

        req.custom.user.name = String(name);

        await userRepository.save(req.custom.user);

        res.status(200).custom.jsonSend({
            status: 'ok',
        });
        return next();
    },
);

export default router;
