import { Request, Response } from '../../infra/middleware/express';
import { userRepository } from '../../domain';
import { BadRequestException } from '../../infra/middleware/handler/exception';
import { GENDER_ENUM } from '../../domain/user/user.entity';

export async function getPendingIndividual(
    _req: Request,
    _res: Response,
    _next: Function,
) {
    const pendingUserList = await userRepository.findPendingIndividual();

    return pendingUserList.map(user => {
        return {
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                phone: user.phone,
                website: user.website,
                gender: user.gender,
                college: user.college,
                major: user.major,
                academicStatus: user.academicStatus,
                studentNumber: user.studentNumber,
                image: user.image,
                isActivate: user.isActivate,
                isIndividual: user.isIndividual,
                isOfficial: user.isOfficial,
                isManager: user.isManager,
            },
        };
    });
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

    if (!pendingUser || !pendingUser.isIndividual || pendingUser.isActivate) {
        throw new BadRequestException('invalid user');
    }
    pendingUser.name = name;
    pendingUser.phone = phone;
    pendingUser.gender =
        Object.values(GENDER_ENUM)[Object.keys(GENDER_ENUM).indexOf(gender)];
    pendingUser.college = college;
    pendingUser.major = major;
    pendingUser.academicStatus = academicStatus;
    pendingUser.isActivate = true;

    await userRepository.save(pendingUser);

    return;
}

export async function getPendingOrganization(
    _req: Request,
    _res: Response,
    _next: Function,
) {
    const pendingUserList = await userRepository.findPendingOrganization();

    return pendingUserList.map(user => {
        return {
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                phone: user.phone,
                website: user.website,
                gender: user.gender,
                college: user.college,
                major: user.major,
                academicStatus: user.academicStatus,
                studentNumber: user.studentNumber,
                image: user.image,
                isActivate: user.isActivate,
                isIndividual: user.isIndividual,
                isOfficial: user.isOfficial,
                isManager: user.isManager,
            },
        };
    });
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

    if (!pendingUser || pendingUser.isIndividual || pendingUser.isActivate) {
        throw new BadRequestException('invalid user');
    }
    pendingUser.isActivate = true;

    await userRepository.save(pendingUser);

    return;
}

export async function deletePendingUser(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.body;

    if (!id || isNaN(id)) {
        throw new BadRequestException('id');
    }

    const pendingUser = await userRepository.findOneById(id);

    if (!pendingUser || pendingUser.isActivate) {
        throw new BadRequestException('invalid user');
    }

    await userRepository.deleteById(pendingUser.id);

    return;
}
