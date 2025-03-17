import { NOT_FOUND } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
    constructor(msg = 'Not found') {
        super(msg, STATUS_CODES[NOT_FOUND], NOT_FOUND);
    }
}
