const RegionDao = require('../dao/RegionDao');

function newLocality(obj) {
    if(obj){
        return {
            id : obj._id,
            pc_id : obj.pc_id,
            st_code : obj.st_code,
            st_name : obj.st_name,
            pc_name : obj.pc_name,
        };
    }
    return {
        id : obj._id,
        pc_id : obj.pc_id,
        st_code : obj.st_code,
        st_name : obj.st_name,
        pc_name : obj.pc_name,
    };   
}

function newPointLocation(lat,long) {
    if(lat && long) {
        return {
            lat : lat,
            long : long
        };
    }
    return {
        lat : null,
        long : null
    };
}

const getLocality = async function(latitude, longitude) {
    var pointLocation = newPointLocation(latitude, longitude);
    try {
        var record = await RegionDao.getConstituency(pointLocation);
        if(!record){
            return null;
        }
        var locality = newLocality(record);
        return locality;
    } catch (e) {
        throw e;
    }
};

module.exports = {
    newLocality,
    newPointLocation,
    getLocality,
}