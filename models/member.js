var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var vali     = require('./validation');


var MemberSchema = new mongoose.Schema({
    name:{
        type:String ,
        required: true,
        validate:vali.nameValidator},

    regno:      {
        type:String ,
        required: true,
        unique:true,
        validate: vali.regValidator},

    email:      {
        type:String ,
        required: true,
        unique:true,
        lowercase: true,
        validate: vali.emailValidator },

    password:   {
        type:String ,
        required: true},

    phoneno:    {
        type:String ,
        required: true,
        validate:vali.phoneValidator},

    authorized: {
        type:Boolean,
        default : false},

    isAdmin:    {
        type:String ,
        default:"0" }
        // 0 means that the user is a normal user. 1 means that the user is an ADMIN

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