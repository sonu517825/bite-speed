const { body, validationResult } = require('express-validator');

module.exports = {
    '/identify': [
        body('email')
            .optional({ nullable: true })
            .isString()
            .trim()
            .withMessage('Email must be a valid string or null')
            .bail()
            .isEmail()
            .withMessage('Email must be a valid email address')
            .bail()
            .if(body('phoneNumber').isEmpty())
            .exists({ checkFalsy: true })
            .withMessage('Either email or phoneNumber is required'),

        body('phoneNumber')
            .optional({ nullable: true })
            .isString()
            .trim()
            .withMessage('PhoneNumber must be a valid string or null')
            .bail()
            .matches(/^\d+$/)
            .withMessage('PhoneNumber must contain only digits')
            .bail()
            .if(body('email').isEmpty())
            .exists({ checkFalsy: true })
            .withMessage('Either email or phoneNumber is required'),
    ]
};
