import { BaseStorageProvider } from '@packages/storage/providers/base-storage.provider';
import { decrypt, encrypt } from '@common/helpers';
import fs from 'node:fs';
import { STORAGE_CONFIG } from '@packages/storage/config';
import { ImageProcessor } from '@packages/storage/processor/image-processor';
import ConfigService from '@/env';

export class LocalStorageProvider extends BaseStorageProvider {
    async upload(file, options = {}) {
        const { originalname, filename, path, size } = file;
        const { folder = 'default', resize = false, resizeOptions = {} } = options;
        try {
            const result = {
                original_name: originalname,
                file_name: filename,
                size,
                mimetype: file.mimetype,
                url: this.getPublicUrl(folder, filename),
                path,
            };

            if (resize && file.mimetype.startsWith('image/')) {
                const resizedResult = await ImageProcessor.resize(file, resizeOptions);
                result.resized_url = this.getPublicUrl(folder, resizedResult.resized_file_name);
            }

            return result;
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async download(path) {
        return path;
    }

    async delete(path) {
        try {
            if (!fs.existsSync(path.replaceAll('\\', '/'))) {
                throw new Error('File not found');
            }

            fs.unlinkSync(path);
            return true;
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async getSignedUrl(path, expiresIn = 3600) {
        return `${ConfigService.PREFIX_FILE_URL}/${encrypt(path)}`;
    }

    getFilePath = (encryptedFilepath) => decrypt(encryptedFilepath);

    generateFileUrl = (filePath) => `${ConfigService.PREFIX_FILE_URL}/${encrypt(filePath)}`;

    getPublicUrl(folder, filename) {
        return `${STORAGE_CONFIG.local.baseUrl}/${folder}/${filename}`;
    }
}
