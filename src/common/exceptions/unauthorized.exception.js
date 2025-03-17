import { UNAUTHORIZED } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class UnauthorizedException extends HttpException {
    constructor(msg = 'Invalid access token') {
        super(msg, STATUS_CODES[UNAUTHORIZED], UNAUTHORIZED);
    }
}
