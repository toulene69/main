const dataAccess = require('../dao/DataAccess');

const UserAuth = {
    username : null,
    email : null,
    password : null,
    phonenumber : null,
    mode : null,
    modified_time : null,
    created_time : null,
}

const getUserAuth = async function(email) {
    try {
        const user = await dataAccess.findUserAuth(email);
        return user;
    }
    catch (e) {
        throw e;
    }    
};



module.exports = {
    UserAuth,
    getUserAuth,
};