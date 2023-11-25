import { Request } from 'express';
import { TransactionLogger } from '../../module/logger';
import { UserEntity } from '../../../domain';

interface CustomRequest extends Request {
    custom: {
        logger: TransactionLogger;
        id?: number;
        user?: UserEntity;
    };
}

export default CustomRequest;
