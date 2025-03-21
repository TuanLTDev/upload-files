import { InValidHttpResponse } from '@common/response';
import { BAD_REQUEST } from 'http-status';
import { STATUS_CODES } from 'http';

export const responseJoiError = (res, error) =>
    new InValidHttpResponse(
        BAD_REQUEST,
        STATUS_CODES[BAD_REQUEST],
        'Bad request',
        error.details?.map((detail) => ({
            type: detail.type,
            message: detail.message,
        })),
    ).toResponse(res);
