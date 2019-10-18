const readline = require('readline');
const fs = require('fs');
const rewind = require('geojson-rewind');
const MongoClient1 = require('mongodb').MongoClient;
const masterURI = 'mongodb+srv://apoorv:Parliament%2328@cluster0-ynvky.mongodb.net?retryWrites=true&w=majority';

MongoClient1.connect(masterURI,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if(err) {
        console.log(e);
        process.exit(1);
    }
    db = client.db('master');
    const readInterface = readline.createInterface({
        input: fs.createReadStream('/Users/aanurag/Desktop/t.json'),
        console: false
    });
    readInterface.on('line', function(line) {
        var obj = JSON.parse(line);
        writeToDb(db, obj).then(val => {

        }).catch(e => {
            
        });
        // checkAndWrite(db, obj).then(val => {

        // }).catch(e => {
        //     console.log(e);
        // });
    });
});

const writeToDb = async function(db,obj){
    collection = db.collection('constituencies');
    console.log("*********** writing id : "+obj.pc_id);
    try {
        await collection.insertOne(obj);
    } catch (e) {
        console.log("Error in inserting to db for id : "+obj.pc_id);
        console.log(e);
    }
}

const checkAndWrite = async function(db,obj) {
    collection = db.collection('constituencies');
    console.log("*********** id : "+obj.properties.pc_id);
    try {
        var record = await collection.find({pc_id:obj.properties.pc_id}).toArray();
        if(record && record.length>0) {
            console.log(obj.properties.pc_id + " is present");
            return;
        }
        console.log("pc_id : "+ obj.properties.pc_id);
        var geometry = rewind(obj.geometry,false);
        var newObj = {
            "pc_id": obj.properties.pc_id, 
            "st_code": obj.properties.st_code, 
            "st_name": obj.properties.st_name, 
            "pc_no": obj.properties.pc_no, 
            "pc_name": obj.properties.pc_name, 
            "pc_category": obj.properties.pc_category, 
            "wikidata_qid": obj.properties.wikidata_qid, 
            "status": obj.properties.status, 
            "geometry": geometry
        };
    
        var s = JSON.stringify(newObj);
        s += '\n';
        
        fs.appendFile('/Users/aanurag/Desktop/sample.json', s, function(err){
            if(err) {
                console.log(err);
            }
        });
    } catch(e) {
        console.log("Error while processing id : "+obj.properties.pc_id);
        console.log(e);
    }
};
