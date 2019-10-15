const logger = require('../../../../config/logger');
const bcrypt = require('bcrypt');
const userAuthModel = require('../../../models/UserAuth');
const userModel = require('../../../models/User');
const userMapperModel = require('../../../models/UserMapper');
const auth_service = require('../../../services/auth_service');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const uuidv4 = require('uuid/v4');
const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();
//.is().not().oneOf(['Passw0rd', 'Password123']);

function newResult(){
    return {
        success: false,
        value: null,
        message: null
    };
}

const registerUser = async function registerUser(input) {
    var {email, password, phone, mode, } = input;
    let newUser = userModel.newUser();
    let newUserAuth = userAuthModel.newUserAuth();
    let result = newResult();
    if (!mode) {
        result.success = false;
        result.message = "Please add registration mode";
        return result;
    }
    if (mode == 'email') {
        email = email.trim();
        if (!emailValidator.validate(email) || !schema.validate(password)) {
            result.success = false;
            result.message = "Email or Password Validation failed.";
            return result;
        }
    }
    else if (mode == 'phonenumber') {

    } else {
        result.success = false;
        result.message = "Improper registration mode";
        return result;
    }
    newUser = {
        username : input.username,
        email : email,
        gender : input.gender,
        dob : input.dob,
        location : input.location,
        phonenumber : input.phonenumber,
        mode : input.mode,
        modified_time : Date(),
        created_time : Date(),
    };
    newUserAuth = {
        username : input.username,
        email : email,
        phonenumber : input.phonenumber,
        mode : input.mode,
        modified_time : Date(),
        created_time : Date(),
    };
    if (mode == 'email') {
        try {
            let userExists = await userAuthModel.getUserAuth(newUserAuth.email);
            if (userExists) { throw "User Already Exists" }
            let hashedPassword = await bcrypt.hash(password, 10);
            newUserAuth.password = hashedPassword;
            let obj = await userModel.addUserAndUserAuth(newUser, newUserAuth);
            result.success = true;
            result.message = "User registered successfully";
            result.value = obj;
            return result;
        } catch (e) {
            result.message = "Error while registration";
            result.value = e;
            return result;
        }
    }
    else if (mode == 'phone') {

    }
    else {
        result.message = "Registration mode can be phone or email.";
        return result;
    }
}

const loginUser = async function (input) {
    var email = input.email.trim();
    var password = input.password;
    var phone = input.phone;
    var mode = input.mode;
    if( mode == 'email') {
        let result = await emailBasedLogin(email, password);
        return result; 
    } else if (mode == 'phone') {

    } else {
        result.message = "Registration mode can be phone or email.";
        return result;
    }
};

const emailBasedLogin = async function(email, password) {
    let result = newResult();
    try {
        const userAuthRecord = await userAuthModel.getUserAuth(email);
        if (!userAuthRecord) {
            result.message = "User not present";
            return result;
        }
        val = await bcrypt.compare(password, userAuthRecord.password);
        if(!val) {
            result.message = "Incorrect password";
            return result;
        }
        const userRecord = await userModel.getUserFromAuth(userAuthRecord);
        var userMapperRecord = await userMapperModel.getUserMapperFromId(userRecord._id);
        if( userMapperRecord === null) {
            userMapperRecord = userMapperModel.newUserMapper();
            userMapperRecord.id = userRecord._id;
        }
        userMapperRecord.uid = uuidv4();
        userMapperRecord.modified_time = Date();
        userMapperRecord.loggedin = true;
        userMapperRecord = await userMapperModel.updateUserMapper(userMapperRecord);
        let token = auth_service.generateJWT(userMapperRecord.uid);
        result.success = true;
        result.message = "User logged in successfully";
        result.value = userRecord;
        result.token = token;
        return result;
    } catch (e) {
        result.message = "Error occured";
        result.value = e;
        return result;
    }
}

const logoutUser = async function(request) {
    const user = request.user;
    let result = newResult();
    if(!user){
        result.message = "User not present..";
        return result;
    }
    try {
        userMapper = await userMapperModel.getUserMapperFromId(user._id);
        if(!userMapper) {
            result.message = "User not present..";
            return result;
        }
        userMapper.loggedin = false;
        userMapper.modified_time = Date();
        userMapper.uid = null;
        let val = await userMapperModel.updateUserMapper(userMapper);
        if(val) {
            result.message = "Logged out successfully..";
            result.success = true;
        } else {
            result.message = "Error while logout...";
        }
        return result;
    } catch (e) {
        result.message = "Some error occurred";
        result.value = e;
        logger.error(e);
        return result;
    }
}

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
};