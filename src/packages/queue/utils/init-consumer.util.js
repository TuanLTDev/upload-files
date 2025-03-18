import { DownloadConsumer } from '@packages/queue/consumer';
import { QUEUE_NAME } from '@packages/queue/constants';
import { DeadLetterQueueConsumer } from '@packages/queue/consumer/dead-letter-queue.consumer';

export const initConsumerUtil = async () => {
    await DeadLetterQueueConsumer.consumeDeadLetterQueue();
    await DownloadConsumer.consumeQueue(QUEUE_NAME.DOWNLOAD_IMAGE);
};
