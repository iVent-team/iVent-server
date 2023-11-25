import TokenManager from '../../module/token';
import { Request, Response } from '../express';
import { userRepository } from '../../../domain';

const validateAccessToken = async (
    req: Request,
    res: Response,
    next: Function,
) => {
    try {
        const accessToken = String(req.header('Authorization') ?? '').replace(
            /^Bearer /,
            '',
        );

        const id: number | Error = await new TokenManager().validateAccessToken(
            accessToken,
        );
        if (id instanceof Error) {
            return res.custom.send(401, {});
        }

        const user = await userRepository.findOneById(id);
        if (!user) {
            return res.custom.send(401, {});
        }
        req.custom.user = user;
    } catch (e) {
        return res.custom.send(500, {});
    }
    next();
};

const validateIndividual = async (
    req: Request,
    res: Response,
    next: Function,
) => {
    try {
        if (!req.custom.user.isIndividual) {
            return res.custom.send(401, {});
        }
    } catch (e) {
        return res.custom.send(500, {});
    }
    next();
};

const validateManager = async (req: Request, res: Response, next: Function) => {
    try {
        if (!req.custom.user.isManager) {
            return res.custom.send(401, {});
        }
    } catch (e) {
        return res.custom.send(500, {});
    }
    next();
};

export { validateAccessToken, validateIndividual, validateManager };
