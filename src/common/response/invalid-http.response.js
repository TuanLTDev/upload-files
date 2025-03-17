import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { STATUS_CODES } from 'http';
import { HttpResponse } from './http.response';

export class InValidHttpResponse extends HttpResponse {
    errorCode;

    message;

    constructor(statusCode, errorCode, message, detail, stack) {
        super(statusCode, {
            timestamp: new Date().toISOString(),
            status: false,
            statusCode,
            errorCode,
            message,
            detail,
            stack,
        });
    }

    static toInternalResponse(msg, stack) {
        return new InValidHttpResponse(
            INTERNAL_SERVER_ERROR,
            STATUS_CODES[INTERNAL_SERVER_ERROR],
            msg,
            undefined,
            stack,
        );
    }

    static toNotFoundResponse(msg, stack) {
        return new InValidHttpResponse(NOT_FOUND, STATUS_CODES[NOT_FOUND], msg, undefined, stack);
    }

    static toBadRequestResponse(msg, detail, stack) {
        return new InValidHttpResponse(BAD_REQUEST, STATUS_CODES[BAD_REQUEST], msg, detail, stack);
    }
}
