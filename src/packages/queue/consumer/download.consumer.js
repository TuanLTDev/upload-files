import RabbitmqService from '@packages/queue/rabbitmq.service';
import { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } from '@packages/queue/constants';
import { logger } from '@packages/logger';
import FileService from '@modules/file/file.service';

export class DownloadConsumer {
    static async getChannel() {
        const rabbitmqService = await RabbitmqService.getInstance();

        return rabbitmqService.getChannel();
    }

    static async consumeQueue(queueName, handler) {
        const channel = await this.getChannel();

        // Declare exchange
        channel.assertExchange(EXCHANGE_NAME.DOWNLOAD_IMAGE, 'direct', { durable: true });

        // Declare main queue
        channel.assertQueue(QUEUE_NAME.DOWNLOAD_IMAGE, {
            durable: true,
            maxLength: 10000,
            deadLetterExchange: EXCHANGE_NAME.DOWNlOAD_IMAGE_DEAD_LETTER_EXCHANGE,
            deadLetterRoutingKey: ROUTING_KEY.DOWNLOAD_IMAGE_DEAD_LETTER_ROUTING_KEY,
        });

        // Bind queues to exchanges
        channel.bindQueue(QUEUE_NAME.DOWNLOAD_IMAGE, EXCHANGE_NAME.DOWNLOAD_IMAGE);

        channel.prefetch(1);
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const message = JSON.parse(msg.content.toString());
                    await handler(message);
                    channel.ack(msg);
                } catch (error) {
                    logger.error('Error processing message:', error);
                    channel.nack(msg, false, false);
                }
            }
        });
    }

    static async consumeDeadLetterQueue() {
        try {
            const channel = await this.getChannel();

            // Declare dead letter exchange
            channel.assertExchange(EXCHANGE_NAME.DOWNlOAD_IMAGE_DEAD_LETTER_EXCHANGE, 'direct', { durable: true });

            // Declare dead letter queue
            channel.assertQueue(QUEUE_NAME.DOWNLOAD_IMAGE_HOT_FIX, {
                durable: true,
            });

            channel.bindQueue(
                QUEUE_NAME.DOWNLOAD_IMAGE_HOT_FIX,
                EXCHANGE_NAME.DOWNlOAD_IMAGE_DEAD_LETTER_EXCHANGE,
                ROUTING_KEY.DOWNLOAD_IMAGE_DEAD_LETTER_ROUTING_KEY,
            );

            channel.consume(QUEUE_NAME.DOWNLOAD_IMAGE_HOT_FIX, async (msg) => {
                if (msg) {
                    const message = JSON.parse(msg.content.toString());
                    try {
                        await FileService.downloadFile(message);
                        channel.ack(msg);
                    } catch (error) {
                        logger.error('Error download image:', message);
                    }
                }
            });
        } catch (error) {
            logger.error('Failed to consume dead letter queue:', error);
            throw error;
        }
    }
}
