
const api_router = require('express').Router();

const v1_router = require('./v1/v1_router');
api_router.use('/v1/',v1_router);

api_router.get('/', function (req, res) {
    res.json({
        status: 'API router Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});
// Export API routes
module.exports = api_router;
