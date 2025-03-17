import Joi from 'joi';

const validationMessages = {
    FULL_NAME: 'Full name must contain only letters, spaces, and characters such as , . - ',
    EMAIL: 'Email must be in a valid format (e.g., user@example.com, user@example.net, user@example.org)',
    PASSWORD: 'Password must be 7-50 characters long, contain at least one digit, and one uppercase letter',
    CONFIRM_PASSWORD: 'Confirm password must match the password',
    ID: 'The provided id is in an invalid format. The ID must be a number greater than 0',
    SORT: 'Sort must be a comma-separated list of field:order pairs, where order is either ASC or DESC',
};

const EMAIL_FORMAT = /^.*@.*\.(com|net|org)$/;
const PWD_FORMAT = /^.*(?=.{7,50})(?=.*\d)(?=.*[A-Z]).*$/;
const FULL_NAME_FORMAT = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
// example: full_name:ASC,createdAt:DESC,updatedAt:DESC
const SORT_FORMAT = /^(\w+:(ASC|DESC),)*(\w+:(ASC|DESC))$/;

export class JoiUtils {
    static fullName = () =>
        Joi.string().pattern(FULL_NAME_FORMAT).required().messages({
            'string.pattern.base': validationMessages.FULL_NAME,
        });

    static email = () =>
        Joi.string().required().pattern(EMAIL_FORMAT).messages({
            'string.pattern.base': validationMessages.EMAIL,
        });

    static password = () =>
        Joi.string().required().pattern(PWD_FORMAT).messages({
            'string.pattern.base': validationMessages.PASSWORD,
        });

    static confirmPassword = () =>
        Joi.string().required().valid(Joi.ref('password')).messages({
            'any.only': validationMessages.CONFIRM_PASSWORD,
        });

    static id = () =>
        Joi.number().required().integer().positive().messages({
            'number.base': validationMessages.ID,
        });

    static sort = () =>
        Joi.string().optional().pattern(SORT_FORMAT).messages({
            'string.pattern.base': validationMessages.SORT,
        });
}
