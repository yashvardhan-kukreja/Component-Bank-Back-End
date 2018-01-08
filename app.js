/**
 * Created by Yash 1300 on 29-12-2017.
 */
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var memberRoutes = require('./routes/memberRoutes');
var adminRoutes = require('./routes/adminRoutes');
var authenticateRoutes = require('./routes/authenticateRoutes');

var port = process.env.PORT || 8000;


//mongodb://yashvardhan:yashvardhan@ds163806.mlab.com:63806/ieeecomponentbank => CLOUD
//mongodb://localhost:27017/componentbank

var db = "mongodb://yashvardhan:yashvardhan@ds163806.mlab.com:63806/ieeecomponentbank";
//var db = "mongodb://localhost:27017/componentbank";
mongoose.connect(db, function(err){
    if (err)
        console.log("Error while connecting to the database");
    else
        console.log("Database connected successfully...")
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/authenticate', authenticateRoutes);
app.use('/member', memberRoutes);
app.use('/admin', adminRoutes);

app.listen(port, function(){
    console.log("App running successfully on port " + port + "...");
});
