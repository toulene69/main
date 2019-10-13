const logger = require('../config/logger');
const MongoClient1 = require('mongodb').MongoClient
const MongoClient2 = require('mongodb').MongoClient
const assert = require('assert');

// databases connection
let state = {
    client : null,
    master : null,
    vault : null,
};

const URI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net?retryWrites=true&w=majority';
const masterURI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net/master?retryWrites=true&w=majority';
const vaultURI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net/vault?retryWrites=true&w=majority';

function startDB(result) {
    var collect = [];
    if(state.master == null) {
        promise1 = new Promise(  (resolve, reject)=> {
            MongoClient1.connect(URI,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
                if (err){
                    logger.error("Error in master db connection...");
                    logger.error(err);
                    reject(err);
                } 
                else {
                    logger.info("master db connected...");
                    state.master = client.db('master');
                    resolve();
                }
            });
        });
        collect.push(promise1);
    }
    if(state.vault == null) {
        promise2 = new Promise( (resolve, reject) => {
            MongoClient2.connect(URI,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
                if (err){
                    logger.error("Error in vault db connection...");
                    logger.error(err);
                    reject(err);
                } 
                else {
                    logger.info("vault db connected...");
                    state.vault = client.db('vault');
                    state.client = client;
                    resolve();
                }
            });
        });
        collect.push(promise2)
    }
    
    Promise.all(collect).then( (value)=>{
        logger.info("All database clients created successfully...");
        result();
    }).catch( (error)=> {
        logger.error("Error in mongoclient creation...");
        logger.error(error);
        result(error);
    });
};

 function getMasterDB() {
    assert.ok(state.master, "Master DB is not initialized...");
    return state.master
};

function getVaultDB() {
    assert.ok(state.vault, "Vault DB is not initialized...");
    return state.vault;
};

function getMongoClient() {
    return state.client;
}

module.exports = {
    startDB,
    getMasterDB,
    getVaultDB,
    getMongoClient,
};

// const close = function(done) {
//   if (state.master) {
//     state.master.close(function(err, result) {
//       state.master = null
      
//       done(err)
//     })
//   }
// }
