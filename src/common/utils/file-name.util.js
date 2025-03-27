export class FileNameUtil {
    static sanitizeFileName(fileName, maxLength = 255) {
        if (!fileName) return '';

        // Remove path traversal characters
        let sanitized = fileName
            .replace(/\.\./g, '')
            .replace(/[^a-zA-Z0-9-_\\.]/g, '_')
            .replace(/_{2,}/g, '_')
            .replace(/^[.-]+|[.-]+$/g, '')
            .toLowerCase();

        // Ensure length constraint
        if (sanitized.length > maxLength) {
            const ext = sanitized.split('.').pop();
            const nameWithoutExt = sanitized.slice(0, -(ext.length + 1));
            sanitized = `${nameWithoutExt.slice(0, maxLength - (ext.length + 6))}_${Date.now().toString(36)}.${ext}`;
        }

        return sanitized;
    }

    static getUniqueFileName(fileName, extension) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const sanitizedName = this.sanitizeFileName(fileName);
        const safeExtension = extension.replace(/[^a-zA-Z0-9]/g, '');

        return `${sanitizedName}_${timestamp}_${random}.${safeExtension}`;
    }

    static isValidFileName(fileName) {
        // Check for common problematic patterns
        const invalidPatterns = [
            /[\\/:"*?<>|]+/, // Invalid characters in most filesystems
            /^\.+$/, // Only dots
            /^(con|prn|aux|nul|com\d|lpt\d)$/i, // Reserved names in Windows
            /^~/, // Hidden files in Unix
            /\s+$/, // Trailing whitespace
        ];

        return !invalidPatterns.some((pattern) => pattern.test(fileName));
    }
}
