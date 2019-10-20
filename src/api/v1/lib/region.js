//@ts-check
const localityModel = require('../../../models/Locality');

function newResult(){
    return {
        success: false,
        value: null,
        message: null
    };
}

const getLocality = async function(input) {
    var lat =  parseFloat(input.query.lat);
    var long = parseFloat(input.query.long);
    var result = newResult();
    try {
        var locality = await localityModel.getLocality(lat, long);
        if(locality) {
            result.success = true;
            result.value = locality;
            result.message = "Locality found";
        } else {
            result.message = "Cannot find locality with lat: "+lat+" long: "+long;
        }
        return result;
    } catch (error) {
        result.value = error;
        return result;
    }
}

module.exports = {
    getLocality,
}