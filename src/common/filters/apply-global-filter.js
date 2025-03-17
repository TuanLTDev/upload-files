export const applyGlobalFilter = (app, filters) => {
    filters.forEach((filter) => {
        if (filter['filter']) {
            app.use(filter.filter);
        } else {
            throw new Error(`${filter.name} is not contain filter method to apply to app context`);
        }
    });
};
