export class BaseStorageProvider {
    async upload(file, options = {}) {
        throw new Error('Method not implemented');
    }

    async download(path) {
        throw new Error('Method not implemented');
    }

    async delete(path) {
        throw new Error('Method not implemented');
    }

    async getSignedUrl(path, expiresIn = 3600) {
        throw new Error('Method not implemented');
    }
}
