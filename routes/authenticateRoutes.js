/**
 * Created by Yash 1300 on 07-01-2018.
 */

const express = require('express');
const Member = require('../models/member');
const authenticate = require('../authenticate');
const router = express.Router();


//Route for registering a user
router.post('/register', function(req, res){

    // Initialising the regexes for regno, email and phoneno
    var regnoRegex = /^[1-2]{1}[4-9]{1}[A-Z]{3}[0-9]{4}$/;
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var phonenoRegex = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/;

    var newMember = new Member({
        name: req.body.name,
        regno: req.body.regno,
        email: req.body.email,
        password: req.body.password,
        phoneno: req.body.phoneno
    });

    // Comparing the regex with values in the request body
    if (!regnoRegex.test(req.body.regno)){
        res.json({success: false, message: "Enter a valid registration number"});
    } else if (!emailRegex.test(newMember.email)){
        res.json({success: false, message: "Enter a valid E-mail ID"});
    } else if (!phonenoRegex.test(newMember.phoneno)){
        res.json({success: false, message: "Enter a valid phone number"});
    } else if (newMember.password.length < 6 || newMember.password.indexOf(" ")!=-1){
        res.json({success:false, message: "Password must be at least 6 characters long and it cannot have any spaces"});
    } else {
        newMember.save(function(err){
            if (err){
                console.log(err);
                if (err.code == 11000)      // Error code 11000 means that error occured due to duplication of some value
                    res.json({success: false, message: "A user with same email or reg num already exists"});
                else
                    res.json({success: false, message: "An error occured"});
            } else {
                res.json({success: true, message: "Registered successfully"});
            }
        });
    }
});

//Route for authenticating a user
router.post('/login', function(req, res, next){
    authenticate.authenticate(req, res, next);
});

module.exports = router;
