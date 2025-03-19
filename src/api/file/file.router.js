import express from 'express';
import FileController from './file.controller';
import { MediaInterceptor } from '@modules/file/interceptor/media.interceptor';

const router = new express.Router();

router.post('/download', FileController.download);
router.post('/upload', new MediaInterceptor(10).intercept, FileController.uploadMany);
router.get('/:encryptedFilepath', FileController.getFile);
router.post('/images/resize', FileController.resizeImageChunk);

export default router;
