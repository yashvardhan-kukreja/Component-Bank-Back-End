var validate = require('mongoose-validator');   // Import Mongoose Validator Plugin

// User E-mail Validator
const emailValidator = [
        validate({
            validator: 'matches',
            arguments: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            message: 'Name must be at least 3 characters, max 50, no special characters or numbers, must have space in between name.'
        }),
        validate({
            validator: 'isLength',
            arguments: [3, 50],
            message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ];


// User Phone Validator
const phoneValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/,
        message: 'Not a correct phone number'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 13],
        message: 'Phone number should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User Registration Number Validator
const regValidator = [
    validate({
        validator: 'matches',
        arguments: /^[1-2]{1}[4-9]{1}[A-Z]{3}[0-9]{4}$/,
        message: 'Not a correct registration number'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 10],
        message: ' Registration number should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


// User Name Validator
const nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^([a-zA-Z]{3,50})+$/,
        message: 'Name must be at least 3 characters, max 50, no special characters or numbers.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

module.exports = {nameValidator: nameValidator, phoneValidator: phoneValidator, emailValidator: emailValidator, regValidator: regValidator};
