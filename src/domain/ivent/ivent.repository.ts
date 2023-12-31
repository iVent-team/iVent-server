import { EntityManager, LessThan, MoreThan } from 'typeorm';
import database from '../../infra/connector/database';
import IventEntity, { IventAttendanceEntity } from './ivent.entity';
import moment = require('moment');

const iventRepository = database.source.getRepository(IventEntity).extend({
    async add(user: IventEntity, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.save<IventEntity>(user);
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .save(user);
    },
    async getListByHostId(limit: number, offset: number, hostId: number) {
        return await database.source
            .getRepository<IventEntity>(IventEntity)
            .createQueryBuilder()
            .where({ hostId })
            .limit(limit)
            .offset(offset)
            .orderBy('start_at', 'ASC')
            .getMany();
    },
    async getList(limit: number, offset: number) {
        return await database.source
            .getRepository<IventEntity>(IventEntity)
            .createQueryBuilder()
            .where({
                isReviewed: true,
            })
            .limit(limit)
            .offset(offset)
            .orderBy('start_at', 'ASC')
            .getMany();
    },
    async findOneById(id: number, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findOneBy<IventEntity>(
                IventEntity,
                {
                    id,
                },
            );
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .findOneBy({ id });
    },
    async findPending(transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findBy<IventEntity>(IventEntity, {
                isReviewed: false,
            });
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .findBy({
                    isReviewed: false,
                });
    },
    async findByHostId(hostId: number, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findBy<IventEntity>(IventEntity, {
                hostId,
            });
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .findBy({ hostId });
    },
    async findFutureByHostId(
        hostId: number,
        transactionManager?: EntityManager,
    ) {
        if (transactionManager)
            return await transactionManager.findBy<IventEntity>(IventEntity, {
                startAt: MoreThan(moment()),
                hostId,
            });
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .findBy({
                    startAt: MoreThan(moment()),
                    hostId,
                });
    },
    async softDeleteById(id: number, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.softDelete<IventEntity>(
                IventEntity,
                {
                    id,
                },
            );
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .softDelete({ id });
    },
});

const iventAttendanceRepository = database.source
    .getRepository(IventAttendanceEntity)
    .extend({
        async add(
            user: IventAttendanceEntity,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.save<IventAttendanceEntity>(
                    user,
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .save(user);
        },
        async findByIventId(
            iventId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.findBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findBy({
                        iventId,
                    });
        },
        async findPendingByIventId(
            iventId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.findBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                        isReviewed: false,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findBy({
                        iventId,
                        isReviewed: false,
                    });
        },
        async findReviewedByIventId(
            iventId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.findBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                        isReviewed: true,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findBy({
                        iventId,
                        isReviewed: true,
                    });
        },
        async getList(limit: number, offset: number, isFinished: boolean) {
            return await database.source
                .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                .createQueryBuilder()
                .where({
                    startAt: isFinished
                        ? LessThan(new Date())
                        : MoreThan(new Date()),
                })
                .limit(limit)
                .offset(offset)
                .orderBy('startAt', isFinished ? 'DESC' : 'ASC')
                .getMany();
        },
        async findOneByIventIdAndAttendeeId(
            iventId: number,
            attendeeId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                // eslint-disable-next-line max-len
                return await transactionManager.findOneBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                        attendeeId,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findOneBy({
                        iventId,
                        attendeeId,
                    });
        },
        async softDeleteByIventId(
            iventId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                // eslint-disable-next-line max-len
                return await transactionManager.softDelete<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .softDelete({ iventId });
        },
        async softDeleteByAttendeeId(
            attendeeId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                // eslint-disable-next-line max-len
                return await transactionManager.softDelete<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        attendeeId,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .softDelete({ attendeeId });
        },
        async findByAttendeeId(
            attendeeId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.findBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        attendeeId,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findBy({ attendeeId });
        },
        async findNotRatedByAttendeeId(
            iventId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.findBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                        isReviewed: true,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findBy({
                        iventId,
                        isReviewed: true,
                    });
        },
        async softDeleteById(id: number, transactionManager?: EntityManager) {
            if (transactionManager)
                // eslint-disable-next-line max-len
                return await transactionManager.softDelete<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        id,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .softDelete({ id });
        },
    });

export default iventRepository;
export { iventAttendanceRepository };
