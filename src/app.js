const express = require('express');
const app = express();
const database = require('./db');
const passport = require('passport');
const auth_service = require('./services/auth_service');
app.use(passport.initialize());

// Logger setup
const morgan = require('morgan');
var logger = require('../config/logger');
app.use(morgan('combined', { stream: logger.stream }));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
 }));

 app.use(bodyParser.json());


 const api_router = require('./api/api_router');
 app.use('/api/', api_router);

 app.get('/', (req, res) => {
     res.send("Hello World!!!!");
 });

const PORT = process.env.PORT || 8000;


database.startDB( function(err) {
    if(err) {
        logger.error('startDB Failed...');
        logger.error(err);
        logger.error("Exiting the process...");
        process.exit(1);
    }
    else {
        app.listen(PORT, () => logger.info(`*******  Server started on post ${PORT}  *******`)) ;
    }
});

// app.listen(PORT, () => logger.info(`*******  Server started on post ${PORT}  *******`)) ;
