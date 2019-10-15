const vaultDB = require('../db').getVaultDB;
const getMongoClient = require('../db').getMongoClient;
const logger = require('../../config/logger');

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

const findUserById = async function(id) {
    let db = vaultDB();
    const users = db.collection('users');
    try {
        userRecord = await users.findOne( {'_id':id} );
        return userRecord;
    } catch(e) {
        throw e;
    }
};

async function insertUserMapper(userMapper) {
    let db = vaultDB();
    const userMapperCollection = db.collection('user_mapper');
    try {
        await userMapperCollection.insertOne(userMapper);
        return userMapper;
    } catch {
        logger.error(e);
        throw e;
    }
}

async function findUserMapper(uid) {
    let db = vaultDB();
    const userMapperCollection = db.collection('user_mapper');
    try {
        let userMapperRecord = await userMapperCollection.findOne({'uid':uid});
        return userMapperRecord;
    } catch {
        logger.error(e);
        throw e;
    }
}

async function findUserMapperFromId(id) {
    let db = vaultDB();
    const userMapperCollection = db.collection('user_mapper');
    try {
        let userMapperRecord = await userMapperCollection.findOne({'id':id});
        return userMapperRecord;
    } catch {
        logger.error(e);
        throw e;
    }
}

async function updateUserMapper(userMapper) {
    let db = vaultDB();
    const userMapperCollection = db.collection('user_mapper');
    try {
        await userMapperCollection.findOneAndUpdate({'id':userMapper.id}, {$set: userMapper}, {upsert: true});
        return userMapper;
    } catch {
        logger.error(e);
        throw e;
    }
}

async function deleteUserMapper(userMapper) {
    let db = vaultDB();
    const userMapperCollection = db.collection('user_mapper');
    try {
        await userMapperCollection.findeOneAndDelete({'uid':userMapper.uid});
        return true;
    } catch {
        logger.error(e);
        throw e;
    }
}

module.exports = {
    findUser,
    findUserById,
    findUserAuth,
    insertUserAndUserAuth,

    insertUserMapper,
    findUserMapper,
    findUserMapperFromId,
    updateUserMapper,
    deleteUserMapper,
};

