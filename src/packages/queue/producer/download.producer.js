import RabbitmqService from '@packages/queue/rabbitmq.service';
import { logger } from '@packages/logger';
import { CacheTTL } from '@common/utils/ttl.util';

export class DownloadProducer {
    static async getChannel() {
        const rabbitmqService = await RabbitmqService.getInstance();

        return rabbitmqService.getChannel();
    }

    static async sendMessage(queueName, message) {
        try {
            const channel = await this.getChannel();
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
                persistent: true,
                expiration: `${CacheTTL.HOUR}`,
            });
        } catch (error) {
            logger.error(error);
        }
    }
}
