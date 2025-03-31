import { logger } from '@packages/logger';
import { BadRequestException } from '@common/exceptions/http';
import { DiskSpaceUtil } from '@common/utils/disk-space.util';
import ConfigService from '@/env';

export class DiskSpaceInterceptor {
    #logger = logger;

    constructor() {
        this.#logger = logger;
    }

    intercept = async (req, response, next) => {
        try {
            const fileSize = req.headers['content-length'];

            if (!fileSize) {
                return next(new BadRequestException('Content-Length header is required'));
            }

            await DiskSpaceUtil.ensureSpace(ConfigService.UPLOAD_FILE_DIR, parseInt(fileSize, 10));

            return next();
        } catch (error) {
            return next(Error('Insufficient storage space'));
        }
    };
}
