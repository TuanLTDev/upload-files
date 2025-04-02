import sharp from 'sharp';

export class ImageProcessor {
    static async resize(file, options = {}) {
        const { width = 300, height = 400, fit = 'inside', withoutEnlargement = true } = options;

        const resizedFilename = `${width}x${height}_${file.filename}`;
        const resizedFilepath = `${file.destination}/${resizedFilename}`;

        try {
            await sharp(file.path, { limitInputPixels: false })
                .resize({
                    width,
                    height,
                    fit,
                    withoutEnlargement,
                })
                .toFile(resizedFilepath);

            return { resized_file_path: resizedFilepath, resized_file_name: resizedFilename };
        } catch (error) {
            throw new Error(`Image resize failed: ${error.message}`);
        }
    }

    static async resizeImage(buffer, options = {}) {
        const { width = 300, height = 400, fit = 'inside', withoutEnlargement = true } = options;

        return sharp(buffer, { limitInputPixels: false })
            .resize({
                width,
                height,
                fit,
                withoutEnlargement,
            })
            .toBuffer();
    }
}
