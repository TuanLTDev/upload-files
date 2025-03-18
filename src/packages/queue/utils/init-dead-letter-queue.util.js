import RabbitmqService from '@packages/queue/rabbitmq.service';
import { EXCHANGE_NAME, QUEUE_NAME, ROUTING_KEY } from '@packages/queue/constants';

export const initDeadLetterQueue = async () => {
    const rabbitmqService = await RabbitmqService.getInstance();
    const channel = rabbitmqService.getChannel();

    await channel.assertExchange(EXCHANGE_NAME.DEAD_LETTER_EXCHANGE, 'direct', { durable: true });

    await channel.assertQueue(QUEUE_NAME.DEAD_LETTER_QUEUE, { durable: true });
    channel.bindQueue(
        QUEUE_NAME.DEAD_LETTER_QUEUE,
        EXCHANGE_NAME.DEAD_LETTER_EXCHANGE,
        ROUTING_KEY.DEAD_LETTER_ROUTING_KEY,
    );
};
