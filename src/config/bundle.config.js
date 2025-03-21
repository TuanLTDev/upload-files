import { logger } from '@packages/logger';
import { InvalidFilterError, InvalidResolverError } from '@common/exceptions/system';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'node:path';
import FileController from '@api/file/file.controller';
import ConfigService from '@/env';

/**
 * @typedef Filter
 * @property {(req, res, next) => {}} filter
 */

export class AppBundle {
    static logger = logger;

    BASE_PATH = '';

    BASE_PATH_SWAGGER = '/docs';

    static builder() {
        AppBundle.logger.info('App is starting bundling');
        return new AppBundle();
    }

    /**
     * @param {import('express-serve-static-core').Express} app
     */
    applyAppContext(app) {
        this.app = app;
        return this;
    }

    applyResolver(resolver) {
        if (!resolver) {
            throw new InvalidResolverError(resolver);
        }

        this.app.use(this.BASE_PATH, resolver.resolve());
        return this;
    }

    /**
     *
     * @param {[Filter]} filters
     * @returns {AppBundle}
     */
    applyGlobalFilters(filters) {
        filters.forEach((filter) => {
            if (filter['filter']) {
                this.app.use(filter.filter);
            } else {
                throw new InvalidFilterError(filter);
            }
        });
        return this;
    }

    applySwagger(swaggerBuilder) {
        this.app.use(
            this.BASE_PATH_SWAGGER,
            swaggerUi.serve,
            swaggerUi.setup(swaggerBuilder.instance, {
                swaggerOptions: {
                    explore: true,
                    deepLinking: true,
                    persistAuthorization: true,
                },
            }),
        );
        logger.info('Building swagger');

        return this;
    }

    /**
     * Default config
     */
    init() {
        AppBundle.logger.info(`Application is in mode ${ConfigService.environment()}`);
        /**
         * Setup basic express
         */
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(cookieParser());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
        this.app.use('/uploads/:encryptedFilepath', FileController.getFile);
        this.app.use('/health', (req, res, next) => {
            res.status(200).send('OK');
        });

        AppBundle.logger.info('Building initial config');

        return this;
    }

    /*
    Setup asynchronous config here
     */
    run() {
        AppBundle.logger.info('Building asynchronous config');
    }
}
