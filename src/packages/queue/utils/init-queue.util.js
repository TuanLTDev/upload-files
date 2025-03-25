import { DownloadConsumer } from '@packages/queue/consumer';
import { QUEUE_NAME } from '@packages/queue/constants';
import FileService from '@modules/file/file.service';

export const initQueueUtil = async () => {
    await DownloadConsumer.consumeQueue(QUEUE_NAME.DOWNLOAD_IMAGE, FileService.downloadFile);
    await DownloadConsumer.consumeDeadLetterQueue();
};
