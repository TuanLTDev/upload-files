import { HandlerResolver } from '@packages/module/handler-resolver';
import { ApiDocument } from '@config/swagger.config';
import { FileResolver } from '@api/file/file.resolver';

export const ModuleResolver = HandlerResolver.builder().addSwaggerBuilder(ApiDocument).addModule([FileResolver]);
