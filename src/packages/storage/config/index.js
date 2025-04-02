export const STORAGE_CONFIG = {
    google: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFileName: process.env.GOOGLE_CLOUD_KEY_FILE,
        bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME,
        baseUrl: process.env.GOOGLE_CLOUD_STORAGE_BASE_URL,
    },
    local: {
        baseUrl: `${process.env.APP_HOST}/${process.env.UPLOAD_FILE_DIR}`,
        uploadDir: process.env.UPLOAD_FILE_DIR || 'uploads',
    },
};
