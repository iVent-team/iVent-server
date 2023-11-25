import { HttpException } from './http.exception';
import { StatusCodes } from 'http-status-codes';

export class UnauthorizedException extends HttpException {
    constructor(message: string) {
        super(StatusCodes.UNAUTHORIZED, message);
    }
}
