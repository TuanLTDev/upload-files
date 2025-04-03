import { BaseStorageProvider } from '@packages/storage/providers/base-storage.provider';
import { Storage } from '@google-cloud/storage';
import { STORAGE_CONFIG } from '@packages/storage/config';
import { CacheTTL } from '@common/utils';
import { InternalServerException } from '@common/exceptions/http';
import { readFile, unlink } from 'fs';
import { promisify } from 'util';
import { ImageProcessor } from '@packages/storage/processor';

export class GoogleStorageProvider extends BaseStorageProvider {
    constructor() {
        super();
        this.storage = new Storage({
            projectId: STORAGE_CONFIG.google.projectId,
            keyFilename: STORAGE_CONFIG.google.keyFileName,
        });

        this.bucket = this.storage.bucket(STORAGE_CONFIG.google.bucketName);
    }

    async upload(file, options = {}) {
        const { folder = 'default', metadata = {}, resize = false, resizeOptions = {} } = options;
        const { originalname, mimetype, filename, size, path } = file;

        const destination = `${folder}/${filename}`;
        const fileStream = this.bucket.file(destination);

        try {
            let { buffer } = file;
            if (!buffer && path) {
                buffer = await promisify(readFile)(path);
            }

            if (!buffer) {
                throw new Error('No file buffer available');
            }

            await fileStream.save(buffer, {
                metadata: {
                    contentType: mimetype,
                    ...metadata,
                },
            });

            const result = {
                path: destination,
                url: this.getPublicUrl(destination),
                original_name: originalname,
                file_name: filename,
                size,
                mimetype,
            };

            if (resize && file.mimetype.startsWith('image/')) {
                const resizedBuffer = await ImageProcessor.resizeImage(buffer, resizeOptions);
                const resizedFileName = `${resizeOptions.width}x${resizeOptions.height}_${filename}`;
                const resizedFileDestination = `${folder}/${resizedFileName}`;
                const resizedFileStream = this.bucket.file(resizedFileDestination);

                await resizedFileStream.save(resizedBuffer, {
                    metadata: {
                        contentType: mimetype,
                        isResized: true,
                        originalFile: destination,
                        ...metadata,
                    },
                });

                result.resized_url = this.getPublicUrl(resizedFileDestination);
            }

            return result;
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        } finally {
            try {
                await promisify(unlink)(file.path);
            } catch (error) {
                this.logger.error(error.message);
                // eslint-disable-next-line no-unsafe-finally
                throw new InternalServerException(error.message);
            }
        }
    }

    async delete(path) {
        try {
            await this.bucket.file(path).delete();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async getSignedUrl(path, expiresIn = CacheTTL.HOUR) {
        try {
            const [url] = await this.bucket.file(path).getSignedUrl({
                action: 'read',
                expires: Date.now() + expiresIn,
            });
            return url;
        } catch (error) {
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }

    async download(path) {
        return path;
    }

    getPublicUrl(path) {
        return `${STORAGE_CONFIG.google.baseUrl}/${STORAGE_CONFIG.google.bucketName}/${path}`;
    }

    async makeBucketPublic() {
        try {
            await this.bucket.makePublic();
        } catch (error) {
            this.logger.error(`Failed to make bucket public: ${error.message}`);
        }
    }
}
