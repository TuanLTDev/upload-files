#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Module dependencies.
 */

import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import RouterConfig from '@config/router.config';
import { applyGlobalFilter, HttpExceptionFilter, InvalidRouteFilter } from '@common/filters';
import * as path from 'node:path';
import { initQueueUtil } from '@packages/queue/utils';
import { logger } from '@packages/logger';
import ConfigService from '@/env';

const app = express();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const parsePort = parseInt(val, 10);

    if (Number.isNaN(parsePort)) {
        // named pipe
        return val;
    }

    if (parsePort >= 0) {
        // port number
        return parsePort;
    }

    return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(ConfigService.appConfig().port);
app.set('port', port);

/**
 * Default config
 */

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Inject router
 */

app.use('/', RouterConfig);

/**
 * Apply global filter
 */

applyGlobalFilter(app, [new InvalidRouteFilter(), new HttpExceptionFilter()]);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, async () => {
    logger.info(`Server is listening on ${port}`);
    await initQueueUtil();
});
server.on('error', onError);
server.on('listening', onListening);
