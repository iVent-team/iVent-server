import { Request, Response } from '../../infra/middleware/express';
import { iventRepository, userRepository } from '../../domain';
import { BadRequestException } from '../../infra/middleware/handler/exception';
import { GENDER_ENUM } from '../../domain/user/user.entity';

export async function getPendingIndividual(
    _req: Request,
    _res: Response,
    _next: Function,
) {
    const pendingUserList = await userRepository.findPendingIndividual();

    return {
        users: await Promise.all(
            pendingUserList.map(async user => {
                return await user.getJsonResponse();
            }),
        ),
    };
}

export async function approvePendingIndividual(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id, name, phone, gender, college, major, academicStatus } =
        req.body;

    if (!id || isNaN(id)) {
        throw new BadRequestException('id');
    }
    if (!name || 'string' !== typeof name || 64 < name.length) {
        throw new BadRequestException('name');
    }
    if (!phone || 'string' !== typeof phone || 11 !== name.length) {
        throw new BadRequestException('phone');
    }
    if (
        !gender ||
        'string' !== typeof gender ||
        Object.keys(GENDER_ENUM).indexOf(gender) < 0
    ) {
        throw new BadRequestException('gender');
    }
    if (!college || 'string' !== typeof college || 64 < college.length) {
        throw new BadRequestException('college');
    }
    if (!major || 'string' !== typeof major || 64 < major.length) {
        throw new BadRequestException('major');
    }
    if ('boolean' !== academicStatus) {
        throw new BadRequestException('academicStatus');
    }

    const pendingUser = await userRepository.findOneById(id);

    if (!pendingUser || !pendingUser.isIndividual || pendingUser.isActivated) {
        throw new BadRequestException('invalid user');
    }
    pendingUser.name = name;
    pendingUser.phone = phone;
    pendingUser.gender =
        Object.values(GENDER_ENUM)[Object.keys(GENDER_ENUM).indexOf(gender)];
    pendingUser.college = college;
    pendingUser.major = major;
    pendingUser.academicStatus = academicStatus;
    pendingUser.isActivated = true;

    await userRepository.save(pendingUser);

    return;
}

export async function getPendingOrganization(
    _req: Request,
    _res: Response,
    _next: Function,
) {
    const pendingUserList = await userRepository.findPendingOrganization();

    return {
        users: await Promise.all(
            pendingUserList.map(async user => {
                return await user.getJsonResponse();
            }),
        ),
    };
}

export async function approvePendingOrganization(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.body;

    if (!id || isNaN(id)) {
        throw new BadRequestException('id');
    }

    const pendingUser = await userRepository.findOneById(id);

    if (!pendingUser || pendingUser.isIndividual || pendingUser.isActivated) {
        throw new BadRequestException('invalid user');
    }
    pendingUser.isActivated = true;

    await userRepository.save(pendingUser);

    return;
}

export async function deleteUser(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.body;

    if (!id || isNaN(id)) {
        throw new BadRequestException('id');
    }

    const pendingUser = await userRepository.findOneById(id);

    if (!pendingUser) {
        throw new BadRequestException('invalid user');
    }

    await userRepository.deleteById(pendingUser.id);

    return;
}

export async function getPendingIvent(
    _req: Request,
    _res: Response,
    _next: Function,
) {
    const pendingIventList = await iventRepository.findPending();

    return {
        ivents: await Promise.all(
            pendingIventList.map(async ivent => {
                return await ivent.getJsonResponse();
            }),
        ),
    };
}

export async function approvePendingIvent(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.body;

    if (!id || isNaN(id)) {
        throw new BadRequestException('id');
    }

    const pendingIvent = await iventRepository.findOneById(id);

    if (!pendingIvent || pendingIvent.isReviewed) {
        throw new BadRequestException('invalid user');
    }
    pendingIvent.isReviewed = true;

    await iventRepository.save(pendingIvent);

    return;
}

export async function deleteIvent(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.body;

    if (!id || isNaN(id)) {
        throw new BadRequestException('id');
    }

    const ivent = await iventRepository.findOneById(id);

    if (!ivent) {
        throw new BadRequestException('invalid user');
    }

    await iventRepository.softDeleteById(ivent.id);

    return;
}
