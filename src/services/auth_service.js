const logger = require('../../config/logger');
const userAuthModel = require('../models/UserAuth');
const userModel = require('../models/User');
const userMapperModel = require('../models/UserMapper');

const passport = require('passport');
const jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '68f35c97-5e74-4f2c-820d-17f0f990800e';

var strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
    logger.info('payload received', jwt_payload);
    try {
        let user_id = await userMapperModel.getUserIdFromUid(jwt_payload.uid);
        if(!user_id) {
            next(null, false);
        }
        let user = await userModel.getUserFromId(user_id);
        if(!user) {
            next(null, false);
        }
        next(null, user);
    } catch (e) {
        next(e, false);
    }
});

passport.use('jwt',strategy);

function generateJWT(uid) {
    var payload = {uid : uid, modified_time : new Date()};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    return token;
}

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else {
        res.status(401).send("Unauthorized ....");
    }
}

module.exports = {
    generateJWT,
    isAuthenticated,
}