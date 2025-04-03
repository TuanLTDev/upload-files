import multer from 'multer';
import fs from 'fs';
import * as path from 'node:path';
import ConfigService from '@/env';

export class MulterHandler {
    #destinationPath;

    #allowedExtensions;

    #keyName;

    #fileQuantity;

    #configurations = {
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, this.#destinationPath);
            },
            filename: (req, file, callback) => {
                callback(null, this.getFileName(file));
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!this.#allowedExtensions.includes(path.extname(file.originalname).toLocaleLowerCase())) {
                return callback(new multer.MulterError('File type is not allowed'));
            }

            return callback(null, true);
        },
    };

    constructor(extensions, keyName, fileQuantity = 1, destinationPath = `${ConfigService.UPLOAD_FILE_DIR}`) {
        this.validateParams(extensions, destinationPath, keyName, fileQuantity);

        this.#destinationPath = destinationPath;
        this.#allowedExtensions = extensions;
        this.#keyName = keyName;
        this.#fileQuantity = fileQuantity;
    }

    validateParams(extensions, destinationPath, keyName, fileQuantity) {
        if (typeof extensions !== 'object' || !Array.isArray(extensions)) {
            throw new Error('extensions must be an array and contain at least one element!');
        }

        fs.access(destinationPath, (error) => {
            if (error) {
                fs.mkdirSync(destinationPath);
            }
        });

        if (!keyName) {
            throw new Error('keyName is required!');
        }

        if (fileQuantity && typeof fileQuantity !== 'number' && fileQuantity < 1) {
            throw new Error('fileQuantity must be a positive integer!');
        }
    }

    getFileName(file) {
        const originalName = file.originalname.substring(0, file.originalname.lastIndexOf('.')) || file.originalname;
        const fileName = originalName
            .replace(/\.\./g, '')
            .replace(/[^a-zA-Z0-9-_\\.]/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^[.-]+|[.-]+$/g, '')
            .toLowerCase();

        return `${fileName}_${Date.now()}${path.extname(file.originalname)}`;
    }

    getHandler() {
        if (this.#fileQuantity > 1) {
            return multer(this.#configurations).array(this.#keyName, this.#fileQuantity);
        }
        return multer(this.#configurations).single(this.#keyName);
    }
}
