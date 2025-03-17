import express from 'express';
import FileController from './file.controller';

const router = new express.Router();

router.post('/download', FileController.download);
router.post('/upload', FileController.download);
router.get('/:encryptedFilename', FileController.getFile);
router.post('/images/resize', FileController.resizeImage);

export default router;
