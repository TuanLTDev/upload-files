import { DefaultValidatorInterceptor } from '@common/interceptors';
import Joi from 'joi';

export const downLoadFileInterceptor = new DefaultValidatorInterceptor(
    Joi.array()
        .items(
            Joi.object({
                url: Joi.string()
                    .uri()
                    .required()
                    .custom((value, helpers) => {
                        if (value.includes('drive.google.com')) {
                            return helpers.error('any.invalid');
                        }
                        return value;
                    })
                    .messages({
                        'any.invalid': 'Google Drive URLs are not allowed',
                        'string.uri': 'URL must be a valid URI',
                        'any.required': 'URL is required',
                        'url.domain': 'URL must be from an allowed domain',
                        'url.invalid': 'Invalid URL format',
                    }),
                name: Joi.string().required().min(2).max(100).messages({
                    'any.required': 'Name is required',
                    'string.empty': 'Name cannot be empty',
                    'string.min': 'Name must be at least {#limit} characters',
                    'string.max': 'Name cannot exceed {#limit} characters',
                }),
            }),
        )
        .min(1)
        .max(100)
        .required()
        .messages({
            'array.min': 'At least one file is required',
            'array.max': 'Cannot exceed {#limit} files',
            'array.unique': 'File names must be unique',
            'array.base': 'Files must be an array',
            'any.required': 'Files array is required',
        }),
);
