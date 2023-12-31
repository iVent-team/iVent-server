import { Request, Response } from '../../infra/middleware/express';
import {
    IventAttendanceEntity,
    iventAttendanceRepository,
    IventEntity,
    iventRepository,
    userRepository,
} from '../../domain';
import {
    BadRequestException,
    NotFoundException,
} from '../../infra/middleware/handler/exception';
import moment = require('moment');
import Aligo from '../../infra/module/aligo';

export async function postIvent(req: Request, _res: Response, _next: Function) {
    const { title, description, address, recruitmentTill, startAt } = req.body;

    if (!title || 'string' !== typeof title || 64 < title.length) {
        throw new BadRequestException('title');
    }
    if (
        !description ||
        'string' !== typeof description ||
        10000 < description.length
    ) {
        throw new BadRequestException('description');
    }
    if (!address || 'string' !== typeof address || 100 < address.length) {
        throw new BadRequestException('address');
    }
    if (!recruitmentTill || isNaN(recruitmentTill)) {
        throw new BadRequestException('recruitmentTill');
    }
    if (!startAt || isNaN(startAt)) {
        throw new BadRequestException('startAt');
    }

    const ivent = new IventEntity(
        req.custom.user.id,
        title,
        description,
        address,
        moment(new Date(recruitmentTill)),
        moment(new Date(startAt)),
    );

    await iventRepository.save(ivent);

    return {
        ivent: await ivent.getJsonResponse(),
    };
}

export async function getIventList(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { limit, offset, myIventOnly } = req.query;

    if (!limit || isNaN(Number(limit)) || 9 < Number(limit)) {
        throw new BadRequestException('limit');
    }
    if (!offset || isNaN(Number(offset)) || Number(offset) < 0) {
        throw new BadRequestException('offset');
    }

    let iventList;
    if ('true' === myIventOnly) {
        iventList = await iventRepository.getListByHostId(
            Number(limit),
            Number(offset),
            req.custom.user.id,
        );
    } else {
        iventList = await iventRepository.getList(
            Number(limit),
            Number(offset),
        );
    }

    return {
        ivent: await Promise.all(
            iventList.map(async ivent => {
                return ivent.getJsonResponse();
            }),
        ),
    };
}

export async function getIventDetail(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.params;

    const ivent = await iventRepository.findOneById(Number(id));

    if (!ivent) {
        throw new NotFoundException('cannot find ivent');
    }

    return {
        ivent: await ivent.getJsonResponse(),
    };
}

export async function joinList(req: Request, _res: Response, _next: Function) {
    const { limit, offset, isFinished } = req.query;

    if (!limit || isNaN(Number(limit)) || 9 < Number(limit)) {
        throw new BadRequestException('limit');
    }
    if (!offset || isNaN(Number(offset)) || Number(offset) < 0) {
        throw new BadRequestException('offset');
    }

    const iventAttendances = await iventAttendanceRepository.getList(
        Number(limit),
        Number(offset),
        'true' === isFinished,
    );

    return await Promise.all(
        iventAttendances.map(iventAttendance => {
            return iventAttendance.getJsonResponse();
        }),
    );
}

export async function joinIvent(req: Request, _res: Response, _next: Function) {
    const { id } = req.params;

    const ivent = await iventRepository.findOneById(Number(id));

    if (!ivent || ivent.hostId === req.custom.user.id || !ivent.isReviewed) {
        throw new NotFoundException('cannot find ivent');
    }

    const existingIventAttendance =
        await iventAttendanceRepository.findOneByIventIdAndAttendeeId(
            ivent.id,
            req.custom.user.id,
        );

    if (existingIventAttendance) {
        throw new BadRequestException('already requested');
    }

    const iventAttendance = new IventAttendanceEntity(
        ivent.id,
        req.custom.user.id,
    );

    await iventAttendanceRepository.save(iventAttendance);

    await Aligo.sendMessage(
        req.custom.user.phone,
        `-iVent-\n${req.custom.user.name}님의 ${ivent.title} 참가 신청이 완료되었습니다` +
            // eslint-disable-next-line max-len
            `\n\n${req.custom.user.name}'s join request for ${ivent.title} has been received`,
    );

    return;
}

export async function getPendingAttendees(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.params;

    const ivent = await iventRepository.findOneById(Number(id));

    if (!ivent || ivent.hostId !== req.custom.user.id) {
        throw new NotFoundException('cannot find ivent');
    }

    const iventAttendances =
        await iventAttendanceRepository.findPendingByIventId(ivent.id);

    return await Promise.all(
        iventAttendances.map(async iventAttendance => {
            return await iventAttendance.getJsonResponse();
        }),
    );
}

export async function approvePendingAttendees(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id, attendanceId } = req.params;

    const ivent = await iventRepository.findOneById(Number(id));

    if (!ivent || ivent.hostId !== req.custom.user.id) {
        throw new NotFoundException('cannot find ivent');
    }

    const iventAttendance =
        await iventAttendanceRepository.findOneById(attendanceId);

    if (!iventAttendance || ivent.id !== iventAttendance.iventId) {
        throw new NotFoundException('cannot find attendance');
    }

    iventAttendance.isReviewed = true;

    await iventAttendanceRepository.save(iventAttendance);

    const attendeeUser = await userRepository.findOneById(
        iventAttendance.attendeeId,
    );

    await Aligo.sendMessage(
        attendeeUser.phone,
        '-iVent-\n' +
            `${attendeeUser.name}님이 요청하신 ${ivent.title}의 참가 검토가 완료되었습니다` +
            // eslint-disable-next-line max-len
            `\n\nReview for join ${ivent.title} by ${attendeeUser.name} has been completed`,
    );

    return;
}

export async function getAttendance(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.params;

    const ivent = await iventRepository.findOneById(Number(id));

    if (!ivent || ivent.hostId !== req.custom.user.id) {
        throw new NotFoundException('cannot find ivent');
    }

    const iventAttendances =
        await iventAttendanceRepository.findReviewedByIventId(ivent.id);

    return await Promise.all(
        iventAttendances.map(async iventAttendance => {
            return await iventAttendance.getJsonResponse();
        }),
    );
}

export async function deleteAttendance(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id, attendanceId } = req.params;

    const ivent = await iventRepository.findOneById(Number(id));

    if (!ivent || ivent.hostId !== req.custom.user.id) {
        throw new NotFoundException('cannot find ivent');
    }

    const iventAttendance =
        await iventAttendanceRepository.findOneById(attendanceId);

    if (!iventAttendance || ivent.id !== iventAttendance.iventId) {
        throw new NotFoundException('cannot find attendance');
    }

    const attendeeUser = await userRepository.findOneById(
        iventAttendance.attendeeId,
    );

    await Aligo.sendMessage(
        attendeeUser.phone,
        '-iVent-\n' +
            `${attendeeUser.name}님이 요청하신 ${ivent.title}의 참가 신청이 삭제되었습니다` +
            // eslint-disable-next-line max-len
            `\n\nJoin request for ${ivent.title} by ${attendeeUser.name} has been removed`,
    );

    await iventAttendanceRepository.softDeleteById(iventAttendance.id);

    return;
}

export async function getRateList(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const iventAttendances =
        await iventAttendanceRepository.findNotRatedByAttendeeId(
            req.custom.user.id,
        );

    return await Promise.all(
        iventAttendances.filter(async iventAttendance => {
            const ivent = await iventRepository.findOneById(
                iventAttendance.iventId,
            );

            return !(
                !ivent ||
                (0 < moment().diff(ivent.startAt) &&
                    moment().diff(ivent.startAt) < 7 * 24 * 60 * 60 * 1000)
            );
        }),
    );
}

export async function rateIventAttendance(
    req: Request,
    _res: Response,
    _next: Function,
) {
    const { id } = req.params;
    const { score } = req.body;

    if ('number' !== typeof score || score < -3 || 3 < score) {
        throw new BadRequestException('score');
    }

    const iventAttendance = await iventAttendanceRepository.findOneById(
        Number(id),
    );

    if (
        !iventAttendance ||
        iventAttendance.attendeeId === req.custom.user.id ||
        iventAttendance.isRated
    ) {
        throw new NotFoundException('cannot find iventAttendance');
    }

    const ivent = await iventRepository.findOneById(iventAttendance.iventId);
    if (
        !ivent ||
        (0 < moment().diff(ivent.startAt) &&
            moment().diff(ivent.startAt) < 7 * 24 * 60 * 60 * 1000)
    ) {
        throw new NotFoundException('cannot find ivent');
    }

    iventAttendance.isRated = true;
    await iventAttendanceRepository.save(iventAttendance);

    const host = await userRepository.findOneById(ivent.hostId);
    if (!host) {
        throw new NotFoundException('cannot find host');
    }

    if (score < 0) {
        host.negativeScore -= score;
    } else {
        host.positiveScore += score;
    }

    await userRepository.save(host);

    return;
}
