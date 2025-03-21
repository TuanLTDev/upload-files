import { ApiDocument } from '@config/swagger.config';
import { SwaggerDocument } from '@packages/swagger/core/document';

ApiDocument.addModel(
    'DownloadFileDto',
    {
        name: SwaggerDocument.ApiProperty({ required: true, type: 'string' }),
        url: SwaggerDocument.ApiProperty({ required: true, type: 'string' }),
    },
    true,
);

export const DownloadFileDto = (body) =>
    body.map((file) => ({
        name: file.name,
        url: file.url,
    }));
