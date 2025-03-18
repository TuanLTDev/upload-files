import RabbitmqService from '@packages/queue/rabbitmq.service';
import FileService from '@modules/file/file.service';
import { EXCHANGE_NAME, ROUTING_KEY } from '@packages/queue/constants';

export class DownloadConsumer {
    static service = FileService;

    static async getChannel() {
        const rabbitmqService = await RabbitmqService.getInstance();

        return rabbitmqService.getChannel();
    }

    static async consumeQueue(queueName) {
        const channel = await this.getChannel();
        await channel.assertQueue(queueName, {
            durable: true,
            maxLength: 5,
            deadLetterExchange: EXCHANGE_NAME.DEAD_LETTER_EXCHANGE,
            deadLetterRoutingKey: ROUTING_KEY.DEAD_LETTER_ROUTING_KEY,
        });

        channel.consume(queueName, async (msg) => {
            if (msg) {
                console.log(msg);
                const message = JSON.parse(msg.content.toString());
                console.log(`📥 Received from queue [${queueName}]:`, message);
                const data = await this.service.downloadFile(message);
                console.log('Download success:', data);
                channel.ack(msg);
            }
        });

        console.log(`🚀 Consumer listening on queue: ${queueName}`);
    }
}
