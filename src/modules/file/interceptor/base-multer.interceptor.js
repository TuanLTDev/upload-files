import { MulterHandler } from '@modules/file/handler/multer.handler';
import res from 'express/lib/response';
import multer from 'multer';
import { BadRequestException, InternalServerException } from '@common/exceptions';

export class BaseMulterInterceptor {
    #uploader;

    constructor(uploader) {
        if (!(uploader instanceof MulterHandler)) {
            throw new Error(`Uploader must be a instance of ${MulterHandler.name}`);
        }

        this.#uploader = uploader;
    }

    intercept = (req, response, next) => {
        const uploadHandler = this.#uploader.getHandler();
        return uploadHandler(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                return next(new BadRequestException(error.code));
            }

            if (error) {
                return next(new InternalServerException(error.message));
            }

            if (!req.file && (!req.files || !Array.isArray(req.files))) {
                return next(new BadRequestException('Upload file is required'));
            }

            return next();
        });
    };
}
