import RabbitmqService from '@packages/queue/rabbitmq.service';
import { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } from '@packages/queue/constants';
import { logger } from '@packages/logger';
import FileService from '@modules/file/file.service';
import { QUEUE_CONFIG } from '@packages/queue/config';

export class DownloadConsumer {
    #logger = logger;

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
                const retryCount = msg.properties.headers?.['x-retry-count'] || 0;
                const message = JSON.parse(msg.content.toString());

                try {
                    if (Number(retryCount) > QUEUE_CONFIG.MAIN_QUEUE.MAX_RETRIES) {
                        this.#logger.error('Message failed permanently after max retries:', {
                            message,
                            retryCount,
                            error: 'Max retries exceeded',
                        });

                        channel.ack(msg);

                        await this.handleFailedMessage(message);
                        return;
                    }

                    await handler(message);
                    channel.ack(msg);
                } catch (error) {
                    this.#logger.error('Error processing message:', {
                        error,
                        message: JSON.parse(msg.content.toString()),
                        retryCount: msg.properties.headers?.['x-retry-count'] || 0,
                    });

                    const newHeaders = {
                        ...msg.properties.headers,
                        'x-retry-count': (msg.properties.headers?.['x-retry-count'] || 0) + 1,
                    };

                    // Reject the message and don't requeue if max retries reached
                    const shouldRequeue = newHeaders['x-retry-count'] < QUEUE_CONFIG.MAIN_QUEUE.MAX_RETRIES;
                    channel.nack(msg, false, shouldRequeue);
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
                    const retryCount = msg.properties.headers?.['x-dlq-retry-count'] || 0;
                    const message = JSON.parse(msg.content.toString());

                    try {
                        if (retryCount >= QUEUE_CONFIG.DEAD_LETTER_QUEUE.MAX_RETRIES) {
                            this.#logger.error('Message failed permanently in DLQ:', {
                                message,
                                retryCount,
                                queue: QUEUE_NAME.DOWNLOAD_IMAGE_HOT_FIX,
                            });

                            channel.ack(msg);
                            await this.handleFailedMessage(message);
                            return;
                        }

                        await FileService.downloadFile(message);
                        channel.ack(msg);
                    } catch (error) {
                        this.#logger.error('Error download image in DLQ:', {
                            error,
                            message,
                            retryCount,
                        });

                        // Republish to DLQ with incremented retry count
                        const newHeaders = {
                            ...msg.properties.headers,
                            'x-dlq-retry-count': retryCount + 1,
                        };

                        const shouldRequeue =
                            newHeaders['x-dlq-retry-count'] < QUEUE_CONFIG.DEAD_LETTER_QUEUE.MAX_RETRIES;
                        channel.nack(msg, false, shouldRequeue);
                    }
                }
            });
        } catch (error) {
            this.#logger.error('Failed to consume dead letter queue:', error);
        }
    }

    // Helper method to handle permanently failed messages
    static async handleFailedMessage(message) {
        try {
            // You could implement any of these options:

            // 1. Store in database
            /*

             */

            // 2. Send notification
            /*

             */

            // 3. Write to specific error log file
            if (QUEUE_CONFIG.LOGGING.ENABLED) {
                this.#logger.error('Permanent queue failure', {
                    queue: QUEUE_NAME.DOWNLOAD_IMAGE,
                    message,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
            this.#logger.error('Error handling failed message:', error);
        }
    }
}
