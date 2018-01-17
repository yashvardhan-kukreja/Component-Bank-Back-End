/**
 * Created by Yash 1300 on 29-12-2017.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var MemberSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    regno:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    password:{
        type:String,
        required: true
    },
    phoneno:{
        type:String,
        required: true
    },
    authorized:{
        type:Boolean,
        default: false
    },
    isAdmin:{
        type:String,
        default:"0" // 0 means that the user is a normal user. 1 means that the user is an ADMIN
    }
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