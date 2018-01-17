/**
 * Created by Yash 1300 on 29-12-2017.
 */
var mongoose = require('mongoose');
var Component = require('./component');

var transactionSchema = new mongoose.Schema({
    componentId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Component'
    },
    componentName:{
        type:String
    },
    memberId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    date:{
        type:Date,
        default: Date.now()
    },
    quantity:{
        type:Number,
        required: true
    },
    returned:{
        type:String,
        required: true
    }
});

//Before saving the transaction, component name will be stored in the transaction as well. This component name is the name of the component corresponding to the provided component ID
// Also, a check will be performed whether the number of components requested by the user are more than the available amount or not
transactionSchema.pre('save', function(next){
    var transaction = this;
    Component.findOne({_id:transaction.componentId}, function(err, outputComponent){
        if (err)
            return next(err);
        else{
            if (!outputComponent){
                return next(new Error('No such component'));
            } else {
                if (parseInt(transaction.quantity)>0 && (parseInt(outputComponent.quantity) - parseInt(transaction.quantity))>=0){
                    transaction.componentName = outputComponent.name;
                    next();
                } else
                    return next(new Error('Please enter a valid quantity'));
            }
        }
    });
});

module.exports = mongoose.model('Transaction', transactionSchema, "transactions");