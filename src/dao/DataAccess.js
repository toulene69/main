const vaultDB = require('../db').getVaultDB;
const getMongoClient = require('../db').getMongoClient;


const  insertUserAndUserAuth = async function(user, userAuth) {
    let db = vaultDB();
    let userAuthCollection = db.collection('user_auth');
    let userCollection = db.collection('users');
    let client = getMongoClient();
    const session = client.startSession({
        defaultTransactionOptions: {
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' },
            readPreference: 'primary'
            }
    });
    session.startTransaction();
    try {
        await userAuthCollection.insertOne(userAuth, {session});
        user.authid = userAuth._id;
        await userCollection.insertOne(user, {session});
        await session.commitTransaction();
        session.endSession();
        return user;
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        throw e;
    }
};

const findUserAuth = async function(email) {
    let db = vaultDB();
    const user_auth = db.collection('user_auth');
    try {
        userRecord = await user_auth.find({'email': email}).toArray();
        return userRecord[0];
    } catch(e) {
        throw e;
    }
};

const findUser = async function(email, authid) {
    let db = vaultDB();
    const users = db.collection('users');
    try {
        userRecord = await users.find( {$or: [{'email': email}, {'authid' : authid} ] } ).toArray();
        return userRecord[0];
    } catch(e) {
        throw e;
    }
};

const findUserMapper = async function(db, callback) {

};

const insertUserMapper = async function(db, callback) {

};

module.exports = {
    findUser,
    findUserAuth,
    insertUserAndUserAuth
};

