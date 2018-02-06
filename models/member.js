/**
 * Created by Yash 1300 on 29-12-2017.
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var validate = require('mongoose-validator');   // Import Mongoose Validator Plugin



// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
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
        arguments: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        message  : 'Not a correct phone number'
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
        arguments: /^\d{2}[A-Z]{3}\d{3,4}$/,
        message  : 'Not a correct registration number'
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
        arguments: /^(([a-zA-Z]{3,50})+$/,
        message: 'Name must be at least 3 characters, max 50, no special characters or numbers.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message  :  'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];




var MemberSchema = new mongoose.Schema({
    name:       {type:String , required: true, validate:nameValidator},
    regno:      {type:String , required: true, unique:true, validate: regValidator},
    email:      {type:String , required: true, unique:true, lowercase: true, validate: emailValidator },
    password:   {type:String , required: true},
    phoneno:    {type:String , required: true, validate: phoneValidator},
    authorized: {type:Boolean, default : false},
    isAdmin:    {type:String , default:"0" }// 0 means that the user is a normal user. 1 means that the user is an ADMIN

});

MemberSchema.pre('save', function(next){
    var member = this;
    bcrypt.hash(member.password, null, null, function(err, hash){
        if (err)
            return next(err);
        member.password = hash;
        next();
    });
});

module.exports = mongoose.model('Member', MemberSchema, "members");