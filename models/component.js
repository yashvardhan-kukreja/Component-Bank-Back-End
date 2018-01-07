/**
 * Created by Yash 1300 on 29-12-2017.
 */
var mongoose = require('mongoose');

var componentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required: true
    },
    value:{
        type:Number,
        required: true
    }
});

componentSchema.pre('save', function(next){
    var component = this;
    if (err)
        return next(err);
    else {
        if (component.quantity<0)
            return next((new Error("Quantity of component going below 0")));
        else
            next();
    }
});

module.exports = mongoose.model('Component', componentSchema, "components");
