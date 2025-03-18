import { initDeadLetterQueue } from '@packages/queue/utils/init-dead-letter-queue.util';
import { initConsumerUtil } from '@packages/queue/utils/init-consumer.util';

export const initQueueUtil = async () => {
    await initDeadLetterQueue();
    await initConsumerUtil();
};
