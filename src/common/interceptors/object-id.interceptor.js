import Joi from 'joi';
import { JoiUtils } from '@common/utils/joi.util';
import { responseJoiError } from '@common/utils/error-filter';

class ObjectIdInterceptor {
    intercept(req, res, next) {
        const schema = Joi.object({
            id: JoiUtils.objectId(),
        });

        const result = schema.validate(req['params']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }

        return next();
    }
}

export const objectIdInterceptor = new ObjectIdInterceptor();
