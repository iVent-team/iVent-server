import { Response } from 'express';

interface CustomResponse extends Response {
    custom: {
        send: Function;
        responseJson?: {};
    };
}

export default CustomResponse;
