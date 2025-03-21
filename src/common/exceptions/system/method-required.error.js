export class MethodRequiredError extends Error {
    constructor(className, method) {
        super(`class ${className} should contain method ${method}`);
    }
}
