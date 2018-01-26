/**
 * Created by Yash 1300 on 06-01-2018.
 */

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

var Member = require('./models/member');
var Transaction = require('./models/transaction');

function checkToken(req, res, next){
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'secret', function(err, decoded){
            if (err){
                return res.json({success: false, message: "An error occured"});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({success: false, message: "No token provided"});
    }
}

function authenticate(req, res, next){
    var email = req.body.email; // Email of the user
    var pass = req.body.password; //Password entered by the user

    Member.findOne({email: email}, function(err, outputMember){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else {
            if (!outputMember)
                return res.json({success: false, message:"No user exists with such details"});
            else {
                if (!bcrypt.compareSync(pass, outputMember.password))
                    return res.json({success: false, message: "Wrong password entered"});
                else{
                    if (outputMember.authorized == false){
                        return res.json({success: false, message: "Currently you are not authorized to access component bank. Make sure you are a part of IEEE VIT Students chapter"});
                    } else {
                        var token = jwt.sign(JSON.parse(JSON.stringify(outputMember)), 'secret');
                        res.header("Set-Cookie","x-access-token="+token);

                        //Finding all the transactions with returned != "1"
                        Transaction.find({memberId: outputMember._id, returned:{$ne:"1"}}, function(err, outputTransactions){
                            if (err){
                                console.log(err);
                                return res.json({success: false, message: "An error occured"});
                            } else {
                                var issued = 0;
                                var requested = 0;
                                for (var i=0;i<outputTransactions.length;i++){
                                    if (outputTransactions[i].returned === '0')
                                        issued += parseInt(outputTransactions[i].quantity);
                                    else
                                        requested += parseInt(outputTransactions[i].quantity);
                                }
                                setTimeout(function(){
                                    return res.json({success: true, message:"User authenticated successfully", name: outputMember.name, regno: outputMember.regno, email: outputMember.email, phoneno: outputMember.phoneno, isAdmin: outputMember.isAdmin, issuedComponents:issued, requestedComponents: requested, token: token});
                                }, 200);
                            }
                        });
                    }
                }
            }
        }
    });
}

module.exports = {authenticate: authenticate, checkToken: checkToken};