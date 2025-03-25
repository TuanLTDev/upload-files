export const QUEUE_NAME = Object.freeze({
    DOWNLOAD_IMAGE: 'download_image_queue',
    DOWNLOAD_IMAGE_HOT_FIX: 'download_image_hot_fix',
});

export const EXCHANGE_NAME = Object.freeze({
    DOWNLOAD_IMAGE: 'download_image_exchange',
    DOWNlOAD_IMAGE_DEAD_LETTER_EXCHANGE: 'download_image_dead_letter_exchange',
});

export const ROUTING_KEY = Object.freeze({
    DOWNLOAD_IMAGE_DEAD_LETTER_ROUTING_KEY: 'download_image_dead_letter_routing_key',
});
