import { HttpException } from './http.exception';
import { StatusCodes } from 'http-status-codes';

export class ForbiddenException extends HttpException {
    constructor(message: string) {
        super(StatusCodes.FORBIDDEN, message);
    }
}
