export class HttpException extends Error {
    errorCode;

    statusCode;

    constructor(msg, errorCode, statusCode) {
        super(msg);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}
