import { SwaggerBuilder } from '@packages/swagger/core/builder';
import ConfigService from '@/env';

const app = ConfigService.appConfig();

const options = {
    openapi: '3.1.0',
    info: {
        version: '1.0.0',
        title: 'Express boilerplate',
        description: 'API documentation',
        termOfService: '',
        contact: ConfigService.swaggerConfig(),
    },
    servers: [
        {
            url: `${app.host}`,
            description: 'Server',
            variables: {
                env: {
                    default: 'app-dev',
                    description: 'Dev Environment',
                },
                port: {
                    enum: ['8443', '5000', '443'],
                    default: app.port,
                },
                basePath: {
                    default: 'api',
                },
            },
        },
        {
            url: app.host,
            description: 'Dev Env',
        },
    ],
    basePath: '',
    auth: true,
};

export const ApiDocument = SwaggerBuilder.builder().addConfig(options);
