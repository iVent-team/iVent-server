import { Request, Response } from '../../infra/middleware/express';
import { IventEntity, iventRepository } from '../../domain';
import {
    BadRequestException,
    NotFoundException,
} from '../../infra/middleware/handler/exception';
import moment = require('moment');

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
    const { limit, offset, filter } = req.query;

    if (!limit || isNaN(Number(limit)) || 9 < Number(limit)) {
        throw new BadRequestException('limit');
    }
    if (!offset || isNaN(Number(offset)) || Number(offset) < 0) {
        throw new BadRequestException('offset');
    }
    if (!filter || 'string' !== filter || 30 < filter.length) {
        throw new BadRequestException('filter');
    }

    const iventList = await iventRepository.getList(
        Number(limit),
        Number(offset),
        filter,
    );

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
