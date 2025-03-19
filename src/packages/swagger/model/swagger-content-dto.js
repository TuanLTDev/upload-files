export const SwaggerContentDto = (rawContent) => ({
    description: rawContent.description,
    method: rawContent.method,
    route: rawContent.route,
    security: rawContent.security,
    tags: rawContent.tags,
    model: rawContent.model,
    body: rawContent.body,
    params: rawContent.params,
    consumes: rawContent.consumes,
    errors: rawContent.errors,
});
