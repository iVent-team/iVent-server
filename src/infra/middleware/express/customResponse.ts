import { Response } from 'express';

interface CustomResponse extends Response {
    custom: {
        jsonSend: Function;
        responseJson?: {};
    };
}

export default CustomResponse;
