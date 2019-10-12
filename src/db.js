const logger = require('../config/logger');
const MongoClient1 = require('mongodb').MongoClient
const MongoClient2 = require('mongodb').MongoClient

// databases connection
const state = {

    master : null,
    vault : null,
};

const URI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net?retryWrites=true&w=majority';
const masterURI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net/master?retryWrites=true&w=majority';
const vaultURI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net/vault?retryWrites=true&w=majority';

exports.startDB = function(result) {
    var collect = [];
    if(state.master == null) {
        promise1 = new Promise(  (resolve, reject)=> {
            MongoClient1.connect(masterURI,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
                if (err){
                    logger.error("Error in master db connection...");
                    logger.error(err);
                    reject(err);
                } 
                else {
                    logger.info("master db connected...");
                    state.master = db;
                    resolve();
                }
            });
        });
        collect.push(promise1);
    }
    if(state.vault == null) {
        promise2 = new Promise( (resolve, reject) => {
            MongoClient2.connect(vaultURI,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
                if (err){
                    logger.error("Error in vault db connection...");
                    logger.error(err);
                    reject(err);
                } 
                else {
                    logger.info("vault db connected...");
                    state.vault = db;
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

exports.getMasterDB = function() {
    return state.master
};

exports.getVaultDB = function() {
    return state.vault;
};

// const close = function(done) {
//   if (state.master) {
//     state.master.close(function(err, result) {
//       state.master = null
      
//       done(err)
//     })
//   }
// }
