import amqp from 'amqplib';
import { logger } from '@packages/logger';
import ConfigService from '@/env';

class RabbitmqService {
    static instance;

    connection = null;

    channel = null;

    amqpUrl = ConfigService.amqpConfig().url;

    static async getInstance() {
        if (!RabbitmqService.instance) {
            RabbitmqService.instance = new RabbitmqService();
            await RabbitmqService.instance.connect();
        }
        return RabbitmqService.instance;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await amqp.connect(this.amqpUrl);
            this.channel = await this.connection.createChannel();
            logger.info('✅ AMQP Connected');
        }
    }

    getChannel() {
        if (!this.channel) {
            throw new Error('AMQP Channel not initialized. Call connect() first.');
        }
        return this.channel;
    }

    async close() {
        await this.channel?.close();
        await this.connection?.close();
        this.channel = null;
        this.connection = null;
        logger.info('🔴 AMQP Connection closed');
    }
}

export default RabbitmqService;
