import { CONFLICT } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class ConflictException extends HttpException {
    constructor(msg = 'Conflict references id') {
        super(msg, STATUS_CODES[CONFLICT], CONFLICT);
    }
}
