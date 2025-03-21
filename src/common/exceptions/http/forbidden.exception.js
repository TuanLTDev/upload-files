import { FORBIDDEN } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class ForbiddenException extends HttpException {
    constructor(msg = 'You do not have permission to access this resource') {
        super(msg, STATUS_CODES[FORBIDDEN], FORBIDDEN);
    }
}
