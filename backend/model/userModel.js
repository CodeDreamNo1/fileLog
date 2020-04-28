var config = require('../config/mongo');
var userModel = {
    getFileJson: (params, callback) => { //获取首页数据
        if (!params) {callback(); return;} 
        config.MongoClient.connect(config.url, {useNewUrlParser: config.useNewUrlParser, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbobj = db.db(config.database);
            var collection = dbobj.collection(config.collection)
            // var collection = dbobj.collection('test')
            collection.aggregate({$group : {_id : "$phone_deviceId", count: {$sum: 1}, phone_position: {$first: '$phone_position'}, phone_type: {$first: '$phone_type'}, phone_version: {$first: '$phone_version'}, node: {$first: '$node'}, time: {$max: '$time'}}},{}).toArray((err,arr) => {
                console.log(params.isdownLoad)  
                if (params.isdownLoad) { //是否导出
                    console.log(arr)  
                                callback(arr);
                                db.close();
                                return;
                            }
                            collection.aggregate({$group : {_id : "$phone_deviceId", count: {$sum: 1}, phone_position: {$first: '$phone_position'}, phone_type: {$first: '$phone_type'}, phone_version: {$first: '$phone_version'}, node: {$first: '$node'}, time: {$max: '$time'}}},              
                                    {$sort: params.sort},
                                    {$skip: (params.currentPage - 1) * params.limit},
                                    {$limit: params.limit},    
                                    {}
                                    ).toArray(function (err, docs) {
                                        var obj = {
                                            total: arr.length,
                                            currentPage: params.currentPage,
                                            data: docs
                                        }
                                           callback(obj);
                                           db.close();
                                       })
                            });
            })         
    },
    getclickInfo: (params, callback) => { //获取用户操作步骤数据
        console.log(params)
        if (!params) {callback(); return;} 
        config.MongoClient.connect(config.url, {useNewUrlParser: config.useNewUrlParser, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbobj = db.db(config.database);
            var collection = dbobj.collection(config.collection)
            // var collection = dbobj.collection('test')
            collection.aggregate({$match: {phone_deviceId: params.id}}, 
                { $project : {
                    _id: 0,
                    mode : 1 ,
                    time : 1 
                }}, {}).toArray((err,arr) => {
                // console.log(params.isdownLoad)  
                // console.log(arr);
                            if (params.isdownLoad) { //是否导出
                                console.log(arr)  
                                            callback(arr);
                                            db.close();
                                            return;
                            }
                            collection.aggregate(
                                    {$match: {phone_deviceId: params.id}}, 
                                    { $project : {
                                        mode : 1 ,
                                        time : 1 ,
                                    }},             
                                    {$sort: params.sort},
                                    {$skip: (params.currentPage - 1) * params.limit},
                                    {$limit: params.limit},    
                                    {}
                                    ).toArray(function (err, docs) {
                                        console.log(docs)
                                        var obj = {
                                            total: arr.length,
                                            currentPage: params.currentPage,
                                            data: docs
                                        }
                                           callback(obj);
                                           db.close();
                                    })
                            });
            })         
    }
    
}
module.exports = userModel