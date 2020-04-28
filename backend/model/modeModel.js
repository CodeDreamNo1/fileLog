var config = require('../config/mongo');
var modeInfo = {
    getModeInfo: (params, callback) => { //获取模块信息
        config.MongoClient.connect(config.url, {useNewUrlParser: config.useNewUrlParser, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbobj = db.db(config.database);
            var collection = dbobj.collection(config.collection)
            collection.aggregate({$group : {_id : "$mode", count: {$sum: 1}}},
            {$sort: params.sort},
            {$skip: (params.currentPage - 1) * params.limit},
            {$limit: params.limit},    
            {}).toArray((err,arr) => {
                    collection.aggregate(
                    {$group: {_id: {mode: "$mode", phone_deviceId: "$phone_deviceId"}}},
                    {$group:{_id: "$_id.mode", userNum: {$sum: 1}}},
                    {}).toArray((err,docs) => {
                        arr.forEach((item, index) => {
                          docs.forEach((items, index) => {
                             if (item._id == items._id) {
                                item['userNum'] = items['userNum'];
                             }
                          })
                        });
                        var obj = {
                            total: arr.length,
                            currentPage: params.currentPage,
                            data: arr
                        }
                        if (callback) callback(obj);
                            db.close();           
                    });
            });
       })
    }
    
}
module.exports = modeInfo