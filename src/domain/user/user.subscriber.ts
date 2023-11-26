import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';
import UserEntity from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    private readonly tableName = 'USER';

    public listenTo() {
        return UserEntity;
    }
}
