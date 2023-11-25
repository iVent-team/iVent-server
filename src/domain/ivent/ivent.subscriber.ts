import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';
import IventEntity from './ivent.entity';

@EventSubscriber()
export class IventSubscriber implements EntitySubscriberInterface<IventEntity> {
    private readonly tableName = 'IVENT';

    public listenTo() {
        return IventEntity;
    }
}
