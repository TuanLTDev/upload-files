import amqp from 'amqplib';
import ConfigService from '@/env';

class AmqpManager {
    static instance;

    connection = null;

    channel = null;

    amqpUrl = ConfigService.amqpConfig().url;

    static getInstance() {
        if (!AmqpManager.instance) {
            AmqpManager.instance = new AmqpManager();
        }
        return AmqpManager.instance;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await amqp.connect(this.amqpUrl);
            this.channel = await this.connection.createChannel();
            console.log('✅ AMQP Connected');
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
        console.log('🔴 AMQP Connection closed');
    }
}

export default AmqpManager;
