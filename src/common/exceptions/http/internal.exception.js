import { INTERNAL_SERVER_ERROR } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class InternalServerException extends HttpException {
    constructor(msg = 'Internal server error') {
        super(msg, STATUS_CODES[INTERNAL_SERVER_ERROR], INTERNAL_SERVER_ERROR);
    }
}
