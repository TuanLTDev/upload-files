import { STORAGE_PROVIDER } from '@packages/storage/constants';
import { GoogleStorageProvider } from '@packages/storage/providers/google-storage.provider';
import { LocalStorageProvider } from '@packages/storage/providers/local-storage.provider';
import { logger } from '@packages/logger';

export class StorageService {
    #logger;

    constructor(provider = STORAGE_PROVIDER.GOOGLE) {
        this.provider = this.initializeProvider(provider);
        this.#logger = logger;
    }

    initializeProvider(provider) {
        switch (provider) {
            case STORAGE_PROVIDER.GOOGLE:
                return new GoogleStorageProvider();
            case STORAGE_PROVIDER.LOCAL:
                return new LocalStorageProvider();
            default:
                throw new Error(`Unsupported storage provider: ${provider}`);
        }
    }

    async uploadImage(file, options = {}) {
        if (!file.mimetype.startsWith('image/')) {
            throw new Error('File is not an image');
        }

        const defaultResizeOptions = {
            width: 300,
            height: 400,
            fit: 'inside',
            withoutEnlargement: true,
        };

        const uploadOptions = {
            ...options,
            resize: true,
            resizeOptions: {
                ...defaultResizeOptions,
                ...options.resizeOptions,
            },
        };

        return this.provider.upload(file, uploadOptions);
    }

    async deleteFile(path) {
        await this.provider.delete(path);
        return true;
    }

    async getSignedUrl(path, expiresIn) {
        return this.provider.getSignedUrl(path, expiresIn);
    }
}
