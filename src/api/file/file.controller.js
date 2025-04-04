import FileService from '@modules/file/file.service';
import { InValidHttpResponse, ValidHttpResponse } from '@common/response';
import * as fs from 'fs';
import { getMimeType } from '@common/helpers';
import { NotFoundException } from '@common/exceptions/http';
import { DownloadProducer } from '@packages/queue/producer';
import { QUEUE_NAME } from '@packages/queue/constants';

class FileController {
    constructor() {
        this.service = FileService;
    }

    download = async (req) => {
        const listFile = req.body;
        const listFileResponse = await this.service.preResponseForDownload(listFile);
        listFileResponse
            .sort((a, b) => a.fileSize - b.fileSize)
            .map(async (file) => {
                await DownloadProducer.sendMessage(QUEUE_NAME.DOWNLOAD_IMAGE, file);
            });

        return ValidHttpResponse.toOkResponse(listFileResponse);
    };

    getFile = async (req, res) => {
        try {
            const { encryptedFilepath } = req.params;
            const filePath = this.service.getFilePath(encryptedFilepath);
            if (!fs.existsSync(filePath.replaceAll('\\', '/'))) {
                throw new NotFoundException('File not found');
            }

            const mimeType = getMimeType(filePath);
            res.setHeader('Content-Type', mimeType);

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (error) {
            InValidHttpResponse.toBadRequestResponse(error.message).toResponse(res);
        }
    };

    uploadMany = async (req) => {
        const files = req.files || req.file;
        const results = await this.service.uploadMany(files);
        return ValidHttpResponse.toOkResponse(results);
    };

    deleteOne = async (req) => {
        const { encryptedFilepath } = req.params;
        const filePath = this.service.getFilePath(encryptedFilepath);
        if (!fs.existsSync(filePath.replaceAll('\\', '/'))) {
            throw new NotFoundException('File not found');
        }

        await this.service.deleteOne(filePath);

        return ValidHttpResponse.toNoContentResponse();
    };
}

export default new FileController();
