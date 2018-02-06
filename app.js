/**
 * Created by Yash 1300 on 29-12-2017.
 */
const mongoose           = require('mongoose');
const express            = require('express');
const bodyParser         = require('body-parser');
const logger             = require('morgan');
const helmet             = require('helmet');
const app                = express();
const compression        = require('compression');
const memberRoutes       = require('./routes/memberRoutes');
const adminRoutes        = require('./routes/adminRoutes');
const authenticateRoutes = require('./routes/authenticateRoutes');

const port = process.env.PORT || 3300;

const database = process.env.DATABASE;

// Connecting the database and making sure that the server runs only if the database connects successfully
mongoose.connect(database, function(err){
    if (err)
        console.log("Error while connecting to the database");
    else {
        console.log("Database connected successfully...");

        // Attaching the dependencies with the server
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
        
        // Secures Express Apps by setting various HTTP headers
        app.use(helmet());
        // Requests that pass through the middleware will be compressed
        app.use(compression());
        
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
