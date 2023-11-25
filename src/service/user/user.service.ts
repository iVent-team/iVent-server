import { Request, Response } from '../../infra/middleware/express';
import { UserEntity, userRepository } from '../../domain';
import PasswordDigester from '../../infra/module/digest';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '../../infra/middleware/handler/exception';
import TokenManager from '../../infra/module/token';
import fs from 'fs';

export async function signUp(req: Request, _res: Response, _next: Function) {
    const { username, password, isIndividual } = req.body;

    if (!username || 64 < username.length) {
        throw new BadRequestException('username');
    }
    if (!password || 128 !== password.length) {
        throw new BadRequestException('password');
    }

    const passwordDigester = new PasswordDigester(password);
    const [digestedPassword, salt]: string[] =
        await passwordDigester.runAndGetResult();

    if (isIndividual) {
        const { website, studentNumber } = req.body;
        if ('string' === typeof website) {
            throw new BadRequestException('website');
        }
        if (!studentNumber || 16 < studentNumber.length) {
            throw new BadRequestException('studentNumber');
        }

        if (await userRepository.findOneByStudentNumber(studentNumber)) {
            throw new BadRequestException('duplicated studentNumber');
        }

        const user = new UserEntity(
            username,
            digestedPassword,
            salt,
            null,
            website,
            null,
            studentNumber,
            false,
            false,
        );

        await userRepository.save(user);

        const tokenObject = await new TokenManager(
            user.id,
        ).generateTokenObject();

        return {
            token: {
                access: tokenObject.accessToken,
                refresh: tokenObject.refreshToken,
            },
        };
    } else {
        const { phone, website, name, isOfficial } = req.body;
        if (!phone || 11 !== phone.length) {
            throw new BadRequestException('phone');
        }
        if ('string' === typeof website) {
            throw new BadRequestException('website');
        }
        if (!name || 64 < name.length) {
            throw new BadRequestException('name');
        }
        if ('boolean' === typeof isOfficial) {
            throw new BadRequestException('name');
        }

        const user = new UserEntity(
            username,
            digestedPassword,
            salt,
            phone,
            website,
            name,
            null,
            true,
            isOfficial,
        );

        await userRepository.save(user);

        const tokenObject = await new TokenManager(
            user.id,
        ).generateTokenObject();

        return {
            token: {
                access: tokenObject.accessToken,
                refresh: tokenObject.refreshToken,
            },
        };
    }
}

export async function signIn(req: Request, _res: Response, _next: Function) {
    const { username, password } = req.body;

    const user = await userRepository.findOneByUsername(username);

    if (!user) {
        throw new BadRequestException('DATA_MISMATCH');
    }

    const passwordDigester = new PasswordDigester(password, user.salt);
    const [digestedPassword, _]: string[] =
        await passwordDigester.runAndGetResult();

    if (digestedPassword !== user.password) {
        throw new BadRequestException('DATA_MISMATCH');
    }

    const tokenObject = await new TokenManager(user.id).generateTokenObject();

    return {
        token: {
            access: tokenObject.accessToken,
            refresh: tokenObject.refreshToken,
        },
    };
}

export async function refresh(req: Request, _res: Response, _next: Function) {
    const { token } = req.query;

    const userIdInString = await new TokenManager().getAndDelRefreshToken(
        String(token),
    );
    if (userIdInString instanceof Error) {
        throw new UnauthorizedException(userIdInString.message);
    }

    const user = await userRepository.findOneById(parseInt(userIdInString, 10));
    if (!user) {
        throw new NotFoundException('cannot find user information');
    }

    const tokenObject = await new TokenManager(
        parseInt(userIdInString, 10),
    ).generateTokenObject();

    return {
        token: {
            access: tokenObject.accessToken,
            refresh: tokenObject.refreshToken,
        },
    };
}

export async function signOut(req: Request, _res: Response, _next: Function) {
    const { token } = req.query;

    await new TokenManager().getAndDelRefreshToken(String(token));

    return;
}

export async function getMyInfo(req: Request, _res: Response, _next: Function) {
    return {
        status: 'ok',
        user: {
            id: req.custom.user.id,
            username: req.custom.user.username,
            name: req.custom.user.name,
            phone: req.custom.user.phone,
            website: req.custom.user.website,
            gender: req.custom.user.gender,
            college: req.custom.user.college,
            major: req.custom.user.major,
            academicStatus: req.custom.user.academicStatus,
            studentNumber: req.custom.user.studentNumber,
            image: req.custom.user.image,
            isActivate: req.custom.user.isActivate,
            isIndividual: req.custom.user.isIndividual,
            isOfficial: req.custom.user.isOfficial,
            isManager: req.custom.user.isManager,
        },
    };
}

export async function withdraw(req: Request, _res: Response, _next: Function) {
    const { token } = req.query;

    await new TokenManager().getAndDelRefreshToken(String(token));

    await userRepository.deleteById(req.custom.user.id);

    return;
}

export async function updateImage(
    req: Request,
    _res: Response,
    _next: Function,
) {
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
        throw new BadRequestException('fail to upload');
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
        throw new BadRequestException('unsupported format');
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

    return;
}

export async function updatePassword(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { password } = req.body;

    const passwordDigester = new PasswordDigester(password);
    const [digestedPassword, salt]: string[] =
        await passwordDigester.runAndGetResult();

    req.custom.user.password = digestedPassword;
    req.custom.user.salt = salt;

    await userRepository.save(req.custom.user);

    return;
}
