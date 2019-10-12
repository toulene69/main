const v1_router = require('express').Router();

v1_router.get('/', function (req, res) {
        res.json({
            status: 'API v1 Its Working',
            message: 'Welcome to RESTHub crafted with love!'
        });
});
    // Export API routes
    
module.exports = v1_router;