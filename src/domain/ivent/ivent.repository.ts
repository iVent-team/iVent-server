import { EntityManager } from 'typeorm';
import database from '../../infra/connector/database';
import IventEntity, { IventAttendanceEntity } from './ivent.entity';

const iventRepository = database.source.getRepository(IventEntity).extend({
    async add(user: IventEntity, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.save<IventEntity>(user);
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .save(user);
    },
    async getList(limit: number, offset: number) {
        return await database.source
            .getRepository<IventEntity>(IventEntity)
            .createQueryBuilder()
            .limit(limit)
            .offset(offset)
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
        async findOneByIventIdAndAttendeeId(
            iventId: number,
            attendeeId: number,
            transactionManager?: EntityManager,
        ) {
            if (transactionManager)
                return await transactionManager.findBy<IventAttendanceEntity>(
                    IventAttendanceEntity,
                    {
                        iventId,
                        attendeeId,
                    },
                );
            else
                return await database.source
                    .getRepository<IventAttendanceEntity>(IventAttendanceEntity)
                    .findBy({
                        iventId,
                        attendeeId,
                    });
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
