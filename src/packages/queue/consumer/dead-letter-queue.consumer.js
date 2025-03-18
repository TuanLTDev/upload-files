import RabbitmqService from '@packages/queue/rabbitmq.service';
import { QUEUE_NAME } from '@packages/queue/constants';

export class DeadLetterQueueConsumer {
    static async getChannel() {
        const rabbitmqService = await RabbitmqService.getInstance();
        return rabbitmqService.getChannel();
    }

    static async consumeDeadLetterQueue() {
        const channel = await this.getChannel();

        await channel.assertQueue(QUEUE_NAME.DEAD_LETTER_QUEUE, { durable: true });

        console.log('🎧 Listening on DLX Queue...');
        channel.consume(QUEUE_NAME.DEAD_LETTER_QUEUE, (msg) => {
            console.log(`📥 DLX Received: ${msg?.content.toString()}`);
            channel.ack(msg);
        });
    }
}
