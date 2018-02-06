/**
 * Created by Yash 1300 on 29-12-2017.
 */
const express      = require('express');
const Member       = require('../models/member');
const Component    = require('../models/component');
const Transaction  = require('../models/transaction');
const Authenticate = require('../middleware/authenticate');
const router       = express.Router();

router.use(function(req, res, next){
    Authenticate.checkToken(req, res, next);
});


//Route for removing a user from the database
router.post('/delete', function(req, res){
    Member.findOneAndRemove({_id: req.decoded._id}, function(err, outputMember){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured while removing the member"});
        } else {
            if (!outputMember)
                res.json({success: false, message:"No member found with the given email"});
            else
                res.json({success: true, message: "Member removed from the database successfully"});
        }
    });
});

//Route for requesting a component
router.post('/requestComponent', function(req, res){
    var compId = req.body.id; //Object id of the component
    var quantity = parseInt(req.body.quantity); //Number of such components user requesting to issue

    Member.findOne({_id: req.decoded._id}, function(err, outputMember){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else {
            if (!outputMember)
                res.json({success: false, message: "No user exists with the following details"});
            else{
                var newTransaction = new Transaction({
                    componentId: compId,
                    memberId: outputMember._id,
                    quantity: quantity,
                    returned: "2"
                });

                newTransaction.save(function(err){
                    if (err){
                        console.log(err);
                        if (err.name === 'CastError')
                            res.json({success:false, message: "No such component exists"});
                        else
                            res.json({success: false, message: "An error occured"});
                    } else {
                        res.json({success: true, message: "Component requested successfully"});
                    }
                });
            }
        }
    });
});

//Route for getting the list of all components
router.get('/getAllComponents', function(req, res){
    Component.find().populate({path:'_id', select: ["name", "quantity", "value"]}).exec(function(err, outputComponents){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else
            res.json({success: true, message: "List of all the components", components: outputComponents});
    });
});



//Route for getting the list of all the user issuing a specific component and also the details of the component
router.post('/getIssuers', function(req, res){
    var compId = req.body.id; //Object ID of the component for which issuers are to be found
    Transaction.find({componentId:compId, returned:"0"}).populate({path:'memberId', select:['name', 'regno', 'email', 'phoneno']}).exec(function(err, outputTransactions){
        if (err){
            res.json({success: false, message: "An error occured"});
        } else {
            Component.findOne({_id:compId}, function(err, outputComponent){
                if (err){
                    console.log(err);
                    res.json({success: false, message: "An error occured"});
                } else {
                    res.json({success: true, message:"All the issuers of the components successfully returned", component: outputComponent, transactions: outputTransactions});
                }
            });
        }
    });
});


//Route for getting the list of all the components which are either issued by user or requested by user or returned by user
/** Route => /getIssuedComponents   **/ //For getting the list of components issued by the user but not returned
/** Route => /getHistory   **/ // For getting the list of components returned by the user successfully
/** Route => /getRequestedComponents   **/ //For getting the list of components requested by the user but not approved by the admin
router.get('/:route', function(req, res){
    var endpoint = req.params.route;
    var returnedStatus = "";
    if (endpoint === "getIssuedComponents")
        returnedStatus = "0";
    else if (endpoint === "getHistory")
        returnedStatus = "1";
    else if (endpoint === "getRequestedComponents")
        returnedStatus = "2";
    else
        returnedStatus = "";
    if (returnedStatus === "")
        res.json({success: false, message: "Wrong endpoint entered!!!"});
    else {
        Member.findOne({_id: req.decoded._id}, function(err, outputMember){
            if (err){
                console.log(err);
                res.json({success: false, message:"An error occured"});
            } else {
                if (!outputMember)
                    res.json({success: false, message: "No such member exists with given email"});
                else{
                    //Finding all the transactions of the current user in which he has issued the component but has not returned them
                    Transaction.find({memberId:outputMember._id, returned:returnedStatus}, function(err, outputTransactions){
                        if (err){
                            console.log(err);
                            res.json({success:false, message:"An error occured"});
                        } else {
                            res.json({success: true, message:"Got all the components on the basis of the route", components:outputTransactions});
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;