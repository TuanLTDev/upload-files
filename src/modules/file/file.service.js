import axios from 'axios';
import { FileSizeUtil } from '@common/utils/file-size.util';
import { decrypt, encrypt } from '@common/helpers';
import fs from 'node:fs';
import ConfigService from '@/env';

class FileService {
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
        const { url, name } = payload;
        const { size: fileSize, contentType } = await this.getFileSizeAndContentType(url);
        const chunkSize = FileSizeUtil.getOptimalChunkSize(fileSize);
        const chunks = Math.ceil(fileSize / chunkSize);

        const { fileName, fileUrl } = this.createFileResponse(name, fileSize, contentType);
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

        fileStream.end(() => {
            console.log(`File saved to ${filePath}`);
            fileStream.close();
        });
        return { fileName, fileUrl, fileSize, chunks };
    };

    getFileName = (encryptedFilename) => decrypt(encryptedFilename);

    createFileResponse = (name, size, contentType) => {
        const fileExtension = contentType.split('/')[1] || 'json';
        const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
        const fileUrl = `${ConfigService.PREFIX_FILE_URL}${encrypt(fileName)}`;

        return { fileName, fileUrl, fileSize: size };
    };

    preResponseForDownload = async (listFile) => {
        const results = await Promise.all(
            listFile.map(async (file) => {
                const { size, contentType } = await this.getFileSizeAndContentType(file.url);
                return this.createFileResponse(file.name, size, contentType);
            }),
        );

        return results;
    };
}

export default new FileService();
