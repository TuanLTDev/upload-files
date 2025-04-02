import { BaseMulterInterceptor } from '@modules/file/interceptor/base-multer.interceptor';
import { MulterHandler } from '@modules/file/handler/multer.handler';
import { STORAGE_FOLDER } from '@packages/storage/constants';
import ConfigService from '@/env';

export class MediaInterceptor extends BaseMulterInterceptor {
    constructor(fileQuantity = 1) {
        super(
            new MulterHandler(
                ['.png', '.jpg', '.jpeg'],
                'image',
                fileQuantity,
                `${ConfigService.UPLOAD_FILE_DIR}/${STORAGE_FOLDER.IMAGES}`,
            ),
        );
    }
}
