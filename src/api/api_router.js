
const api_router = require('express').Router();
const logger = require('../../config/logger');
const account = require('./v1/lib/account');
const passport = require('passport');

const v1_regions = require('./v1/v1_regions');
api_router.use('/v1/region/',v1_regions);

const v1_router = require('./v1/v1_router');
api_router.use('/v1/',passport.authenticate('jwt', { session : false }),v1_router);

api_router.get('/', function (req, res) {
    res.json({
        status: 'API router Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

    
api_router.post('/register', function(req, res) {

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

api_router.post('/login', function(req,res){
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
});

api_router.post('/logout', passport.authenticate('jwt', { session : false }), function(req, res){
    account.logoutUser(req).then(val => {
        if(val.success) {
            res.status(200).send(val);
        } else {
            res.status(404).send(val);
        }
    }).catch(e => {
        res.status(500).send(e);
    });
});


// Export API routes
module.exports = api_router;
