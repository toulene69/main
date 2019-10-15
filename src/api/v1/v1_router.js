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

    
v1Router.post('/register', function(req, res) {

    try {
        account.registerUser(req.body).then(val => {
            if(val.success) {
                res.status(200).send(val);
            }
            else {
                res.status(500).send(val);
            }
        }).catch(e => {
            res.status(500).send(e);
        });
    } catch (e) {
        res.status(500).send(e);
    }    
});

v1Router.post('/login', function(req,res){
    try {
        account.loginUser(req.body).then(val => {
            if(val.success) {
                res.status(200).send(val);
            }
            else {
                res.status(500).send(val);
            }
        }).catch(e => {
            res.status(500).send(e);
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

v1Router.get('/auth',passport.authenticate('jwt', { session: false }), function(req,res){
    logger.info("Reached here...");
    res.status(200).send("Success");
});

v1Router.post('/logout', function(req, res){

});


module.exports = v1Router;