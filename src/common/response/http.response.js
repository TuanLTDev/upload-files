export class HttpResponse {
    statusCode;

    data;

    constructor(statusCode, data) {
        this.statusCode = statusCode;
        this.data = data;
    }

    toResponse(res) {
        return res.status(this.statusCode).json(this.data);
    }
}
