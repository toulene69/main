const dataAccess = require('../dao/DataAccess');

const User = {
    authid : null,
    username : null,
    email : null,
    phonenumber : null,
    gender : null,
    dob : null,
    location : null,
    mode : null,
}

const addUserAndUserAuth = async function(newUser, newUserAuth) {
    try {
        let result = await dataAccess.insertUserAndUserAuth(newUser, newUserAuth);
        return result;
    } catch (e) {
        throw e;
    }
};

const getUserFromAuth = async function(userAuth) {
    try {
        let user = await dataAccess.findUser(userAuth.email, userAuth._id);
        return user;
    } catch (e) {
        throw e;
    }
}


module.exports = {
    User,
    addUserAndUserAuth,
    getUserFromAuth,
}