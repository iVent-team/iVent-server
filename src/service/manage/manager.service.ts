import { Request, Response } from '../../infra/middleware/express';
import { iventRepository, userRepository } from '../../domain';
import { BadRequestException } from '../../infra/middleware/handler/exception';
import { GENDER_ENUM } from '../../domain/user/user.entity';
import Aligo from '../../infra/module/aligo';

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

    if (pendingUser.phone) {
        await Aligo.sendMessage(
            pendingUser.phone,
            `-iVent-\n${pendingUser.name}님의 계정 검토가 완료되었습니다` +
                `\n\n${pendingUser.name}'s account review has been completed`,
        );
    }

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

    if (pendingUser.phone) {
        await Aligo.sendMessage(
            pendingUser.phone,
            `-iVent-\n${pendingUser.name}님의 계정 검토가 완료되었습니다` +
                `\n\n${pendingUser.name}'s account review has been completed`,
        );
    }

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

    const user = await userRepository.findOneById(id);

    if (!user) {
        throw new BadRequestException('invalid user');
    }

    if (user.phone) {
        await Aligo.sendMessage(
            user.phone,
            '-iVent-\n계정이 관리자에 의해 삭제되었습니다' +
                '\n\nAccount has been removed by manager',
        );
    }

    await userRepository.deleteById(user.id);

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

    const host = await userRepository.findOneById(pendingIvent.hostId);

    if (host && host.phone) {
        await Aligo.sendMessage(
            host.phone,
            '-iVent-\n' +
                `${host.name}님이 등록하신 ${pendingIvent.title}의 등록 검토가 완료되었습니다` +
                // eslint-disable-next-line max-len
                `\n\nReview for ${pendingIvent.title} by ${host.name} has been completed`,
        );
    }

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

    const host = await userRepository.findOneById(ivent.hostId);

    if (host && host.phone) {
        await Aligo.sendMessage(
            host.phone,
            // eslint-disable-next-line max-len
            `-iVent-\n${host.name}님이 등록하신 ${ivent.title}이(가) 관리자에 의해 삭제되었습니다` +
                // eslint-disable-next-line max-len
                `\n\n${ivent.title} by ${host.name} has been removed by manager`,
        );
    }

    await iventRepository.softDeleteById(ivent.id);

    return;
}
