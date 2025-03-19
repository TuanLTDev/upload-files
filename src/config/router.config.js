import express from 'express';
import ApiRouter from '@api/api.router';
import FileController from '@api/file/file.controller';
import ConfigService from '@/env';

const router = express.Router();

router.use(ConfigService.appConfig().apiPrefix, ApiRouter);
router.use('/uploads/:encryptedFilepath', FileController.getFile);

export default router;
