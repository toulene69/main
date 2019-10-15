const v1Router = require('express').Router();
const logger = require('../../../config/logger');
const account = require('./lib/account');
const passport = require('passport');

v1Router.get('/', function (req, res) {
        res.json({
            status: 'API v1 Its Working',
            message: 'Welcome to RESTHub crafted with love!'
        });
});
    // Export API routes
v1Router.get('/auth1', function(req,res){
    logger.info("Reached here...");
    res.status(200).send("Success");
});

v1Router.get('/auth', function(req,res){
    logger.info("Reached here...");
    res.status(200).send("Success");
});

v1Router.post('/logout', function(req, res){

});


module.exports = v1Router;