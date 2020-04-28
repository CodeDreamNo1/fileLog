var config = require('../config/mongo');
var unitlModel = {
    insertFileJson: (params, callback) => { //定时存入mongo数据 
        config.MongoClient.connect(config.url, {useNewUrlParser: config.useNewUrlParser}, function(err, db) {
            if (err) throw err;
            var dbobj = db.db(config.database);
            var collection = dbobj.collection(config.collection)
            collection.insertMany(params).then(function (res) {
                callback(res);
                db.close();
            });
        });  
    }
}
module.exports = unitlModel