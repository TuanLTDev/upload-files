import { CONFLICT } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class DuplicateException extends HttpException {
    constructor(msg = 'Duplicate record') {
        super(msg, STATUS_CODES[CONFLICT], CONFLICT);
    }
}
