export class FileSizeUtil {
    static KB = 1024;

    static MB = this.KB * 1024;

    static GB = this.MB * 1024;

    static TB = this.GB * 1024;

    static bytes(n) {
        return n;
    }

    static kilobytes(n) {
        return n / this.KB;
    }

    static megabytes(n) {
        return n / this.MB;
    }

    static gigabytes(n) {
        return n / this.GB;
    }

    static terabytes(n) {
        return n / this.TB;
    }

    static format(size) {
        if (size < this.KB) return `${this.bytes(size).toFixed(2)} B`;
        if (size < this.MB) return `${this.kilobytes(size).toFixed(2)} KB`;
        if (size < this.GB) return `${this.megabytes(size).toFixed(2)} MB`;
        if (size < this.TB) return `${this.gigabytes(size).toFixed(2)} GB`;
        return `${this.terabytes(size).toFixed(2)} TB`;
    }

    static getOptimalChunkSize = (fileSize) => {
        if (fileSize < 10 * 1024 * 1024) return 1024 * 512;
        if (fileSize < 100 * 1024 * 1024) return 1024 * 1024 * 2;
        if (fileSize < 500 * 1024 * 1024) return 1024 * 1024 * 5;
        return 1024 * 1024 * 10;
    };
}
