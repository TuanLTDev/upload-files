import FileService from '@modules/file/file.service';
import { ValidHttpResponse } from '@common/response';
import * as fs from 'fs';
import { getMimeType } from '@common/helpers';
import { NotFoundException } from '@common/exceptions';
import { FileSizeUtil } from '@common/utils/file-size.util';
import { DownloadProducer } from '@packages/queue/producer';
import { QUEUE_NAME } from '@packages/queue/constants';
import ConfigService from '@/env';

class FileController {
    constructor() {
        this.service = FileService;
    }

    download = async (req, res) => {
        const listFile = req.body;
        listFile.map(async (file) => {
            await DownloadProducer.sendMessage(QUEUE_NAME.DOWNLOAD_IMAGE, file);
        });

        const data = await this.service.preResponseForDownload(listFile);
        return ValidHttpResponse.toOkResponse(data).toResponse(res);
    };

    getFile = (req, res) => {
        const { encryptedFilename } = req.params;
        const originalFilename = this.service.getFileName(encryptedFilename);

        const filePath = `${ConfigService.UPLOAD_FILE_DIR}/${originalFilename}`;
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }

        const mimeType = getMimeType(originalFilename);
        res.setHeader('Content-Type', mimeType);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    };

    resizeImageChunk = async (req, res) => {
        const { url } = req.body;

        const { size: fileSize, contentType } = await this.service.getFileSizeAndContentType(url);
        const chunkSize = FileSizeUtil.getOptimalChunkSize(fileSize);
        const chunks = Math.ceil(fileSize / chunkSize);

        const fileChunks = await Promise.allSettled(
            Array.from({ length: chunks }, async (_, i) => {
                const start = i * chunkSize;
                const end = Math.min(fileSize - 1, start + chunkSize - 1);
                const data = await this.service.downloadChunk(url, start, end);
                return { index: i, data };
            }),
        );

        const sortedChunks = fileChunks
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value)
            .sort((a, b) => a.index - b.index);

        const buffers = sortedChunks.map((chunk) => chunk.data);
        res.setHeader('Content-Type', contentType);
        res.send(buffers);
    };
}

export default new FileController();
