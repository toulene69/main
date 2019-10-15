const dataAccess = require('../dao/DataAccess');

const UserMapper = {
    uid : null,
    id : null,
    loggedin : false,
    modified_time : null,
}


async function addUserMapper(userMapper) {
    try {
        await dataAccess.insertUserMapper(userMapper);
        return userMapper;
    } catch (e) {
        throw e;
    }
}

async function getUserIdFromUid(uid) {
    try {
        let userMapper = await dataAccess.findUserMapper(uid);
        return userMapper.id;
    } catch (e) {
        throw e;
    }
}

async function getUserMapperFromId(id){
    try {
        let userMapper = await dataAccess.findUserMapperFromId(id);
        if(userMapper){
            return userMapper.id;
        } else {
            return null;
        }
    } catch (e) {
        throw e;
    }
}

async function updateUserMapper(userMapper) {
    try {
        let obj = await dataAccess.updateUserMapper(userMapper);
        return obj;
    } catch (e) {
        throw e;
    }
}

async function deleteUserMapper(userMapper) {
    try {
        let success = await dataAccess.deleteUserMapper(userMapper);
        return success;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    UserMapper,
    addUserMapper,
    getUserIdFromUid,
    updateUserMapper,
    deleteUserMapper,
    getUserMapperFromId,
};