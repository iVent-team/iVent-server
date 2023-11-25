import { EntityManager, Like } from 'typeorm';
import database from '../../infra/connector/database';
import IventEntity from './ivent.entity';

const iventRepository = database.source.getRepository(IventEntity).extend({
    async add(user: IventEntity, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.save<IventEntity>(user);
        else
            return await database.source
                .getRepository<IventEntity>(IventEntity)
                .save(user);
    },
    async getList(limit: number, offset: number, filter: string) {
        return await database.source
            .getRepository<IventEntity>(IventEntity)
            .createQueryBuilder()
            .where({ title: Like('%' + filter + '%') })
            .orWhere({ description: Like('%' + filter + '%') })
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

export default iventRepository;
