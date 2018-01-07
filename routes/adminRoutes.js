/**
 * Created by Yash 1300 on 29-12-2017.
 */

var mongoose = require('mongoose');
var express = require('express');
var Component = require('../models/component');
var Transaction = require('../models/transaction');
var authenticate = require('../authenticate');
var router = express.Router();

//Checking the token before executing any route
router.use(function(req, res, next){
    authenticate.checkToken(req, res, next);
});


//Route for registering a component
router.post('/registerComponent', function(req, res){
    var newComponent = new Component({
        name: req.body.name, //Name of the component
        quantity: parseInt(req.body.quantity), //Quantity of such components being offered to users
        value: parseInt(req.body.value) //Value of the component in Rupees
    });

    newComponent.save(function(err){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else {
            res.json({success: true, message: "Component registered successfully"});
        }
    });
});

//Route for removing a component from the database
router.post('/deleteComponent', function(req, res){
    var id = req.body.id; //The object id of the component in the database
    Component.findOneAndRemove({_id:id}, function(err, outputComponent){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured while deleting the component"});
        } else {
            if (!outputComponent)
                res.json({success: false, message:"No component found with the given id"});
            else
                res.json({success: true, message: "Component removed from the database successfully"});
        }
    });
});

router.post('/deleteRequest', function(req, res){
    var id = req.body.id; //Transaction id corresponding to the request
    Transaction.findOneAndRemove({_id:id, returned:"2"}, function(err, outputTransaction){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else {
            res.json({success: true, message:"Request deleted successfully"});
        }
    });
});


//Route for approving the request of an issued component
router.post('/approve', function(req, res){
    var transactionId = req.body.id; //Object ID of the transaction to be approved
    Transaction.findOne({_id:transactionId}, function(err, outputTransaction){
        if (err){
            console.log(err);
            if (err.name === 'CastError')
                res.json({success: false, message: "Wrong transaction ID entered"});
            else
                res.json({success:false, message:"An error occured"});
        } else {
            if (!outputTransaction)
                res.json({success: false, message: "No such transaction exists with the given transaction id"});
            else {
                if (outputTransaction.returned === "2"){
                    Component.findOne({_id:outputTransaction.componentId}, function(err, outputComponent){
                        if (err){
                            console.log(err);
                            res.json({success:false, message:"An error occured"});
                        } else {
                            if (!outputComponent)
                                res.json({success: false, message: "No such component exists"});
                            else{
                                var finalQuantity = parseInt(outputComponent.quantity) - parseInt(outputTransaction.quantity);
                                if (finalQuantity < 0){
                                    res.json({success: false, message: "Component quantity going below 0"});
                                } else {
                                    outputTransaction.returned = "0";
                                    outputTransaction.save(function(err){
                                        if (err){
                                            console.log(err);
                                            res.json({success: false, message: "An error occured"});
                                        } else {
                                            outputComponent.quantity = finalQuantity;
                                            outputComponent.save(function(err){
                                                if (err){
                                                    console.log(err);
                                                    res.json({success: false, message: "An error occured"});
                                                } else {
                                                    res.json({success: true, message: "Component request corresponding to the transaction approved successfully"});
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    });
                } else {
                    res.json({success: false, message: "Request already approved for the component corresponding to the following transaction"});
                }
            }
        }
    });
});


//Route for declaring a component as returned
router.post('/return', function(req, res){
    var transId = req.body.id;
    Transaction.findOneAndUpdate({_id:transId, returned:"0"}, {returned:"1"}, function(err, outputTransaction){
        if (err){
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else {
            if (!outputTransaction)
                res.json({success: false, message: "Either no such transaction exists or The request for issuing the component is not approved yet or the component is already returned"});
            else {
                if (outputTransaction.returned === "0"){
                    Component.findOne({_id:outputTransaction.componentId}, function(err, outputComponent){
                        if (err){
                            console.log(err);
                            res.json({success: false, message: "An error occured"});
                        } else {
                            if (!outputComponent)
                                res.json({success:false, message: "No such component exists"});
                            else {
                                outputComponent.quantity = parseInt(outputComponent.quantity) + parseInt(outputTransaction.quantity);
                                outputComponent.save(function(err){
                                    if (err){
                                        console.log(err);
                                        res.json({success: false, message: "An error occured"});
                                    } else
                                        res.json({success: true, message: "Component returned successfully"});
                                });
                            }
                        }
                    });
                } else if (outputTransaction.returned === "1")
                    res.json({success: false, message: "The component is already returned"});
                else
                    res.json({success: false, message: "The request for issuing the component is not approved yet"});

            }
        }
    });
});

//Adding more number of already existing components
router.post('/addComponents', function(req, res) {
    var compId = req.body.id;
    var quan = parseInt(req.body.quantity);
    Component.findOneAndUpdate({_id: compId}, {$inc: {quantity: quan}}, function (err, outputComponent) {
        if (err) {
            console.log(err);
            res.json({success: false, message: "An error occured"});
        } else {
            if (!outputComponent)
                res.json({success: false, message: "No such component exists"});
            else {
                res.json({success: true, message: "Component updated successfully"});
            }
        }
    });
});

//Route for getting the list of all the requests or issuers
/** Route => /requests   **/ //For getting the list of all the requests for components
/** Route => /issuers   **/ // For getting the list of all the users who have issued component but not returned
router.post('/:route', function(req, res){
    var endpoint = req.params.route;
    var returnedStatus = "";
    if (endpoint === 'issuers')
        returnedStatus = "0";
    else if (endpoint === 'requests')
        returnedStatus = "2";
    else
        returnedStatus = "";

    if (!(returnedStatus === "")){
        Transaction.find({returned: returnedStatus}).populate('memberId').exec(function(err, outputTransactions){
            if (err){
                console.log(err);
                res.json({success: false, message:"An error occured", error: err});
            } else {
                res.json({success: true, message:"Listed all the respective users", output: outputTransactions});
            }
        });
    } else
        res.json({success: false, message: "Wrong endpoint entered"});
});

module.exports = router;
