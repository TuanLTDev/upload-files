import { MediaInterceptor } from '@modules/file/interceptor/media.interceptor';
import { Module } from '@packages/module/module';
import { encryptedFilePathParam } from '@modules/file/dto/encrypted-file-path.param';
import { downLoadFileInterceptor } from '@modules/file/interceptor';
import FileController from './file.controller';

export const FileResolver = Module.builder()
    .addPrefix({
        prefixPath: '/api/v1/files',
        tag: 'File APIs',
        module: 'FileModule',
    })
    .register([
        {
            route: '/download',
            method: 'post',
            interceptors: [downLoadFileInterceptor],
            body: 'DownloadFileDto',
            controller: FileController.download,
            preAuthorization: false,
        },
        {
            route: '/upload',
            method: 'post',
            consumes: ['multipart/form-data'],
            interceptors: [new MediaInterceptor(10)],
            controller: FileController.uploadMany,
            preAuthorization: false,
        },
        {
            route: '/images/resize',
            method: 'post',
            controller: FileController.resizeImageChunk,
            preAuthorization: false,
        },
        {
            route: '/:encryptedFilepath',
            method: 'get',
            params: [encryptedFilePathParam],
            controller: FileController.getFile,
        },
    ]);
