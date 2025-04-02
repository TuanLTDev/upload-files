import { HttpException } from '../exceptions/http';
import { InValidHttpResponse } from '../response';

export class HttpExceptionFilter {
    filter(err, req, res, next) {
        if (err instanceof HttpException) {
            return new InValidHttpResponse(err.statusCode, err.errorCode, err.message, null, err.stack).toResponse(res);
        }
        if (err instanceof Error) {
            return InValidHttpResponse.toInternalResponse(err.message, err.stack).toResponse(res);
        }
        return next();
    }
}
