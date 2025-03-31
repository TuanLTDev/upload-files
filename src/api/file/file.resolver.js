import { MediaInterceptor } from '@modules/file/interceptor/media.interceptor';
import { Module } from '@packages/module/module';
import { downLoadFileInterceptor } from '@modules/file/interceptor';
import { encryptedFilePathParam } from '@modules/file/dto/encrypted-file-path.param';
import { DiskSpaceInterceptor } from '@common/interceptors/disk-space.interceptor';
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
            description: 'Download file from url public - exclude file from drive',
        },
        {
            route: '/upload',
            method: 'post',
            consumes: ['multipart/form-data'],
            interceptors: [new DiskSpaceInterceptor(), new MediaInterceptor(10)],
            controller: FileController.uploadMany,
            preAuthorization: false,
            description: 'Upload file for media - apply only image',
        },
        {
            route: '/upload/:encryptedFilepath',
            method: 'delete',
            params: [encryptedFilePathParam],
            controller: FileController.deleteOne,
            preAuthorization: true,
            description: 'Delete file',
        },
        {
            route: '/images/resize',
            method: 'post',
            controller: FileController.resizeImageChunk,
            preAuthorization: false,
        },
    ]);
