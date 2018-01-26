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

var db = "mongodb://ieee:ieee@ds247587.mlab.com:47587/componentbank";

// Connecting the database and making sure that the server runs only if the database connects successfully
mongoose.connect(db, function(err){
    if (err)
        console.log("Error while connecting to the database");
    else {
        console.log("Database connected successfully...");

        // Attaching the dependencies with the server
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));

        // Attaching the routes with server
        app.use('/authenticate', authenticateRoutes);
        app.use('/member', memberRoutes);
        app.use('/admin', adminRoutes);

        // Starting the server
        app.listen(port, function(){
            console.log("App running successfully on port " + port + "...");
        });
    }
});