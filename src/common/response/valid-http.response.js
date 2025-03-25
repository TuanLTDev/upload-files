import { CREATED, NO_CONTENT, OK } from 'http-status';
import { HttpResponse } from './http.response';

export class ValidHttpResponse extends HttpResponse {
    static toOkResponse(data) {
        const result = {
            timestamp: new Date(),
            status: true,
            statusCode: OK,
            data: data?.data ?? data,
            meta: data?.meta ?? undefined,
        };
        return new HttpResponse(OK, result);
    }

    static toNoContentResponse() {
        return new HttpResponse(NO_CONTENT);
    }

    static toCreatedResponse(data) {
        const result = {
            timestamp: new Date(),
            status: true,
            statusCode: CREATED,
            data: data?.data ?? data,
            meta: data?.meta ?? undefined,
        };
        return new HttpResponse(CREATED, result);
    }
}
