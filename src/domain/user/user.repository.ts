import { EntityManager } from 'typeorm';
import database from '../../infra/connector/database';
import UserEntity from './user.entity';

const userRepository = database.source.getRepository(UserEntity).extend({
    async add(user: UserEntity, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.save<UserEntity>(user);
        else
            return await database.source
                .getRepository<UserEntity>(UserEntity)
                .save(user);
    },
    async findOneById(id: number, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findOneBy<UserEntity>(UserEntity, {
                id,
            });
        else
            return await database.source
                .getRepository<UserEntity>(UserEntity)
                .findOneBy({ id });
    },
    async findByName(name: string, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findBy<UserEntity>(UserEntity, {
                name: name,
            });
        else
            return await database.source
                .getRepository<UserEntity>(UserEntity)
                .findBy({ name: name });
    },
    async findByPhone(phone: string, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findOneBy<UserEntity>(UserEntity, {
                phone,
            });
        else
            return await database.source
                .getRepository<UserEntity>(UserEntity)
                .findOneBy({ phone });
    },
    async findByEmail(email: string, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.findOneBy<UserEntity>(UserEntity, {
                email,
            });
        else
            return await database.source
                .getRepository<UserEntity>(UserEntity)
                .findOneBy({ email });
    },
    async deleteById(id: number, transactionManager?: EntityManager) {
        if (transactionManager)
            return await transactionManager.delete<UserEntity>(UserEntity, {
                id,
            });
        else
            return await database.source
                .getRepository<UserEntity>(UserEntity)
                .delete({ id });
    },
});

export default userRepository;