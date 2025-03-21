import { SwaggerDocument } from '@packages/swagger/core/document';

export const encryptedFilePathParam = SwaggerDocument.ApiParams({
    name: 'encryptedFilepath',
    paramsIn: 'path',
    type: 'string',
    required: true,
    description: 'Encrypted file path',
});
