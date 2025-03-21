import { MulterHandler } from '@modules/file/handler/multer.handler';
import res from 'express/lib/response';
import multer from 'multer';
import { BadRequestException, InternalServerException } from '@common/exceptions/http';
import { logger } from '@packages/logger';

export class BaseMulterInterceptor {
    #uploader;

    #logger;

    constructor(uploader) {
        if (!(uploader instanceof MulterHandler)) {
            throw new Error(`Uploader must be a instance of ${MulterHandler.name}`);
        }

        this.#uploader = uploader;
        this.#logger = logger;
    }

    intercept = (req, response, next) => {
        const uploadHandler = this.#uploader.getHandler();
        return uploadHandler(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                this.#logger.error(error.errorCode);
                return next(new BadRequestException(error.code));
            }

            if (error) {
                this.#logger.error(error.message);
                return next(new InternalServerException(error.message));
            }

            if (!req.file && (!req.files || !Array.isArray(req.files))) {
                return next(new BadRequestException('Upload file is required'));
            }

            return next();
        });
    };
}
