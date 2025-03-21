import express from 'express';
import { AppBundle } from '@config/bundle.config';
import { HttpExceptionFilter, InvalidRouteFilter } from '@common/filters';
import { ApiDocument } from '@config/swagger.config';
import { ModuleResolver } from '@/api';

const app = express();
(async () => {
    await AppBundle.builder()
        .applyAppContext(app)
        .init()
        .applyResolver(ModuleResolver)
        .applySwagger(ApiDocument)
        .applyGlobalFilters([new InvalidRouteFilter(), new HttpExceptionFilter()])
        .run();
})();

export default app;
