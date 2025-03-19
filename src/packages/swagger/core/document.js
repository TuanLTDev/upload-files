export class SwaggerDocument {
    static DEFAULT_GENERATOR = 'string';

    static PRIMITIVE_TYPES = ['string', 'int', 'dateTime', 'bool'];

    static type = {
        string: {
            type: 'string',
        },
        int: {
            type: 'integer',
            format: 'int64',
        },
        dateTime: {
            type: 'string',
            format: 'date-time',
        },
        bool: {
            type: 'boolean',
            default: true,
        },
        file: {
            type: 'file',
        },
        object: {
            type: 'object',
        },
        array: (item, params = {}) => {
            if (SwaggerDocument.PRIMITIVE_TYPES.includes(item)) {
                return {
                    type: 'array',
                    items: {
                        ...SwaggerDocument.type[item],
                        ...params,
                    },
                };
            }

            return {
                type: 'array',
                items: {
                    $ref: `#/components/schemas/${item}`,
                },
            };
        },
        enum: (enumModel, params = {}) => ({
            type: 'string',
            enum: Object.values(enumModel),
            ...params,
        }),
        model: (dtoModel, params = {}) => ({
            $ref: `#/components/schemas/${dtoModel}`,
            ...params,
        }),
    };
}
