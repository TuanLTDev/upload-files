import { BAD_REQUEST } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpException } from './http-exception';

export class BadRequestException extends HttpException {
    constructor(msg = 'Bad request') {
        super(msg, STATUS_CODES[BAD_REQUEST], BAD_REQUEST);
    }
}
