import axios from 'axios';
import { FileSizeUtil } from '@common/utils/file-size.util';
import { decrypt, encrypt } from '@common/helpers';
import fs from 'node:fs';
import sharp from 'sharp';
import { logger } from '@packages/logger';
import { FileNameUtil } from '@common/utils';
import { DiskSpaceUtil } from '@common/utils/disk-space.util';
import { NotFoundException } from '@common/exceptions/http';
import ConfigService from '@/env';

class FileService {
    #logger;

    constructor() {
        this.#logger = logger;
    }

    getFileSizeAndContentType = async (url) => {
        const response = await axios.head(url);
        return {
            size: parseInt(response.headers['content-length'], 10),
            contentType: response.headers['content-type'],
        };
    };

    downloadChunk = async (url, start, end) => {
        const { data } = await axios.get(url, {
            headers: { Range: `bytes=${start}-${end}` },
            responseType: 'arraybuffer',
        });

        return data;
    };

    downloadFile = async (payload) => {
        const { url, originalName, fileName, fileSize, mimetype } = payload;

        await DiskSpaceUtil.ensureSpace(ConfigService.UPLOAD_FILE_DIR, fileSize);

        const chunkSize = FileSizeUtil.getOptimalChunkSize(fileSize);
        const chunks = Math.ceil(fileSize / chunkSize);

        const filePath = `${ConfigService.UPLOAD_FILE_DIR}/${fileName}`;
        const fileStream = fs.createWriteStream(filePath);

        const fileChunks = await Promise.allSettled(
            Array.from({ length: chunks }, async (_, i) => {
                const start = i * chunkSize;
                const end = Math.min(fileSize - 1, start + chunkSize - 1);
                const data = await this.downloadChunk(url, start, end);
                return { index: i, data };
            }),
        );

        const sortedChunks = fileChunks
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value)
            .sort((a, b) => a.index - b.index);

        sortedChunks.forEach((chunk) => {
            fileStream.write(chunk.data);
        });

        let fileResizeUrl;
        fileStream.end(async () => {
            fileStream.close();
            const width = 300;
            const height = 400;
            const fileResizePath = `${ConfigService.UPLOAD_FILE_DIR}/${width}x${height}_${fileName}`;
            fileResizeUrl = await this.resizeImage(filePath, fileResizePath);
        });

        return { originalName, fileName, fileUrl: url, fileResizeUrl, fileSize, mimetype };
    };

    getFilePath = (encryptedFilepath) => decrypt(encryptedFilepath);

    createFileResponse = (url, name, size, contentType) => {
        const fileExtension = contentType.split('/')[1] || 'json';
        let fileName = FileNameUtil.getUniqueFileName(name, fileExtension);

        if (!FileNameUtil.isValidFileName(fileName)) {
            this.#logger.warn(`Invalid filename detected: ${name}`);
            // Use a fallback name if necessary
            fileName = `file_${Date.now()}.${fileExtension}`;
        }
        const filePath = `${ConfigService.UPLOAD_FILE_DIR}/${fileName}`;
        const fileUrl = `${ConfigService.PREFIX_FILE_URL}/${encrypt(filePath)}`;

        const width = 300;
        const height = 400;
        const fileResizePath = `${ConfigService.UPLOAD_FILE_DIR}/${width}x${height}_${fileName}`;
        const fileResizeUrl = this.generateFileUrl(fileResizePath);

        return { url, originalName: name, fileName, fileUrl, fileResizeUrl, fileSize: size, mimetype: contentType };
    };

    preResponseForDownload = async (listFile) => {
        const results = await Promise.all(
            listFile.map(async (file) => {
                const { size, contentType } = await this.getFileSizeAndContentType(file.url);
                return this.createFileResponse(file.url, file.name, size, contentType);
            }),
        );

        return results;
    };

    uploadOne = async (file) => {
        const { originalname, mimetype, destination, filename, path, size } = file;
        const width = 300;
        const height = 400;
        const fileResizePath = `${destination}/${width}x${height}_${filename}`;
        await sharp(path, { limitInputPixels: false })
            .resize({
                width,
                height,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .toFile(fileResizePath);
        return {
            originalName: originalname,
            fileName: filename,
            fileUrl: this.generateFileUrl(path),
            fileSize: size,
            mimetype,
            fileResizeUrl: this.generateFileUrl(fileResizePath),
        };
    };

    uploadMany = async (files) => {
        const tasks = files.map((file) => this.uploadOne(file));
        return Promise.all(tasks);
    };

    deleteOne = async (filePath) => {
        const fileName = filePath.split('/').pop();
        const directory = filePath.substring(0, filePath.lastIndexOf('/'));

        const resizedPath = `${directory}/300x400_${fileName}`;

        const deletedFiles = [];

        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            fs.unlinkSync(filePath);
            deletedFiles.push({
                type: 'original',
                path: filePath,
                size: stats.size,
            });
            this.#logger.info(`Deleted original file: ${fileName}`);
        }

        if (fs.existsSync(resizedPath)) {
            const stats = fs.statSync(resizedPath);
            fs.unlinkSync(resizedPath);
            deletedFiles.push({
                type: 'resized',
                path: resizedPath,
                size: stats.size,
            });
            this.#logger.info(`Deleted resized file: ${fileName}`);
        }

        if (deletedFiles.length === 0) {
            throw new NotFoundException(`No files found for path: ${filePath}`);
        }
    };

    deleteMany = async (files) => {
        const tasks = files.map((file) => this.deleteOne(file));
        await Promise.allSettled(tasks);
    };

    generateFileUrl = (filePath) => `${ConfigService.PREFIX_FILE_URL}/${encrypt(filePath)}`;

    resizeImage = async (path, fileResizePath, width = 300, height = 400) => {
        try {
            await sharp(path, { limitInputPixels: false })
                .resize({
                    width,
                    height,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .toFile(fileResizePath);

            return this.generateFileUrl(fileResizePath);
        } catch (error) {
            this.#logger.error(error);
        }
    };
}

export default new FileService();
