const express = require('express');
const app = express();
const database = require('./db');

// Logger setup
const morgan = require('morgan');
var logger = require('../config/logger');
app.use(morgan('combined', { stream: logger.stream }));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
 }));

 app.use(bodyParser.json());


 const apiRoutes = require('./routers');

 app.use('/api/v1', apiRoutes);
 
 app.get('/', (req, res) => {
     var masterDb = database.get().db('master');
 
     console.log(masterDb);
     res.send("Hello World!!!!");
 });



const PORT = process.env.PORT || 8000;


database.startDB( function(err) {
    if(err) {
        logger.error('startDB Failed...');
        logger.error(err);
        logger.error("Exiting the process...");
        process.exit(1);
    }
    else {
        app.listen(PORT, () => logger.info(`*******  Server started on post ${PORT}  *******`)) ;
    }
});
