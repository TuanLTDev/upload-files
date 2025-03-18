import RabbitmqService from '@packages/queue/rabbitmq.service';
import { EXCHANGE_NAME, ROUTING_KEY } from '@packages/queue/constants';

export class DownloadProducer {
    static async getChannel() {
        const rabbitmqService = await RabbitmqService.getInstance();

        return rabbitmqService.getChannel();
    }

    static async sendMessage(queueName, message) {
        const channel = await this.getChannel();
        await channel.assertQueue(queueName, {
            durable: true,
            maxLength: 5,
            deadLetterExchange: EXCHANGE_NAME.DEAD_LETTER_EXCHANGE,
            deadLetterRoutingKey: ROUTING_KEY.DEAD_LETTER_ROUTING_KEY,
        });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`✅ Sent to queue [${queueName}]:`, message);
    }
}
