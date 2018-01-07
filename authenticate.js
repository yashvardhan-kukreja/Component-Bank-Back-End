/**
 * Created by Yash 1300 on 06-01-2018.
 */

var jwt = require('jsonwebtoken');


function checkToken(req, res, next){
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'secret',function(err, decoded){
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

module.exports = {checkToken: checkToken};