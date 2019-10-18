const getMasterDB = require('../db').getMasterDB;
const logger = require('../../config/logger');

const getConstituency = async function (pointLocation) {
    try {
        const db = getMasterDB();
        var constituencies = db.collection('constituencies');
        var constituency = await constituencies.find({
            "geometry": {
                "$geoIntersects": {
                    "$geometry": {
                        "type":"Point", 
                        "coordinates":[pointLocation.lat, pointLocation.long]
                    }
                }
            }
        }).toArray();
        if(constituency && constituency.length>0){
            return constituency[0];
        }
        else {
            return null;
        }
    } catch (e) {
        logger.error(e);
        throw e;
    }
}


module.exports = {
    getConstituency,
};