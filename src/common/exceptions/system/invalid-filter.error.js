export class InvalidFilterError extends Error {
    constructor(filter) {
        super(`${filter.name} is not contain filter method to apply to app context`);
    }
}
