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
            return res.status(401).custom.send({
                status: 'fail',
                message: '접근 권한이 없습니다',
            });
        }

        const user = await userRepository.findOneById(id);
        if (!user) {
            return res.status(401).custom.send({
                status: 'fail',
                message: '접근 권한이 없습니다',
            });
        }
        req.custom.user = user;
    } catch (e) {
        return res.status(500).custom.send({
            status: 'fail',
            message: '알 수 없는 오류가 발생하였습니다',
        });
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
            return res.status(401).custom.send({
                status: 'fail',
                message: '접근 권한이 없습니다',
            });
        }
    } catch (e) {
        return res.status(500).custom.send({
            status: 'fail',
            message: '알 수 없는 오류가 발생하였습니다',
        });
    }
    next();
};

const validateManager = async (req: Request, res: Response, next: Function) => {
    try {
        if (!req.custom.user.isManager) {
            return res.status(401).custom.send({
                status: 'fail',
                message: '접근 권한이 없습니다',
            });
        }
    } catch (e) {
        return res.status(500).custom.send({
            status: 'fail',
            message: '알 수 없는 오류가 발생하였습니다',
        });
    }
    next();
};

export { validateAccessToken, validateIndividual, validateManager };
