export class ArgumentRequiredError extends Error {
    constructor(arg, context) {
        super(`${arg} is required in ${context}`);
    }
}
