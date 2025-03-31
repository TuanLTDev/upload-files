import { FileSizeUtil } from '@common/utils/file-size.util';
import { logger } from '@packages/logger';
import { execSync } from 'child_process';

export class DiskSpaceUtil {
    #logger = logger;

    static MIN_FREE_SPACE = 5 * FileSizeUtil.GB;

    static checkDiskSpace(uploadPath) {
        try {
            const df = execSync(`df -B1 ${uploadPath} | tail -1`).toString();
            const available = parseInt(df.split(/\s+/)[3], 10);

            return {
                available,
                isEnoughSpace: available > this.MIN_FREE_SPACE,
                minimumRequired: this.MIN_FREE_SPACE,
            };
        } catch (error) {
            this.#logger.error('Error checking disk space:', error);
        }
    }

    static async ensureSpace(uploadPath, fileSize) {
        const { available, isEnoughSpace, minimumRequired } = this.checkDiskSpace(uploadPath);

        const spaceAfterUpload = available - fileSize;

        if (spaceAfterUpload < this.MIN_FREE_SPACE) {
            throw new Error(
                `Insufficient disk space. Need to maintain minimum ${this.formatBytes(minimumRequired)} free space`,
            );
        }

        return true;
    }

    static formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';

        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}
