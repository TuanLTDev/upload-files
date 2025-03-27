export const QUEUE_CONFIG = {
    MAIN_QUEUE: {
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
    },
    DEAD_LETTER_QUEUE: {
        MAX_RETRIES: 2,
        RETRY_DELAY: 5000,
    },
    LOGGING: {
        ENABLED: true,
        STORED_FAILED: false,
        NOTIFY_ON_FAILED: false,
    },
};
