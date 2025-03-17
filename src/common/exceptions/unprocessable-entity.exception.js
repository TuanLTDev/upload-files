import { UNPROCESSABLE_ENTITY } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class UnprocessableEntityException extends HttpException {
    constructor(msg = 'Unprocessable Entity') {
        super(msg, STATUS_CODES[UNPROCESSABLE_ENTITY], UNPROCESSABLE_ENTITY);
    }
}
