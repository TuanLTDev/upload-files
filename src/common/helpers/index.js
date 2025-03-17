import crypto from 'node:crypto';
import * as path from 'node:path';
import ConfigService from '@/env';

const { encryptAlgorithm, encryptKey } = ConfigService.encryptConfig();

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(encryptAlgorithm, encryptKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'base64url');
    encrypted += cipher.final('base64url');

    return iv.toString('base64url') + encrypted;
};

export const decrypt = (encryptedText) => {
    const iv = Buffer.from(encryptedText.substring(0, 22), 'base64url');
    const encryptedData = encryptedText.substring(22);

    const decipher = crypto.createDecipheriv(encryptAlgorithm, encryptKey, iv);
    let decrypted = decipher.update(encryptedData, 'base64url', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

export const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.mp4': 'video/mp4',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};
