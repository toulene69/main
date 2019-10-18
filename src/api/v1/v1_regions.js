const v1Regions = require('express').Router();
const logger = require('../../../config/logger');

const region = require('./lib/region');

v1Regions.get('/locality', function(req, res) {
    region.getLocality(req).then(val => {
        if(val.success) {
            res.status(200).send(val);
        } else {
            res.status(404).send(val);
        }
    }).catch(e => {
        logger.error("/locality request with error : ");
        logger.error(e);
        res.status(500).send(e);
    });
});


module.exports = v1Regions;