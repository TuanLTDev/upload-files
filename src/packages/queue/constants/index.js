export const QUEUE_NAME = Object.freeze({
    DOWNLOAD_IMAGE: 'download_image_queue',
    UPLOAD_IMAGE: 'upload_image_queue',
    RESIZE_IMAGE: 'restart_image_queue',
    DEAD_LETTER_QUEUE: 'dead_letter_queue',
});

export const EXCHANGE_NAME = Object.freeze({
    DEAD_LETTER_EXCHANGE: 'dead_letter_exchange',
});

export const ROUTING_KEY = Object.freeze({
    DEAD_LETTER_ROUTING_KEY: 'dead_letter_routing_key',
});
