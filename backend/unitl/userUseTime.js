var config = require('../config/mongo');
var upData = {
    updataUserTime: () => { //获取首页数据
        config.MongoClient.connect(config.url, {useNewUrlParser: config.useNewUrlParser, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbobj = db.db(config.database);
            var collection = dbobj.collection(config.collection)
            // var collection = dbobj.collection('test')
            var count = collection.find().count(); //扫描集合条数
            var userUseTimeCount = dbobj.collection('userUseTime').find().count()
            var limit = 1000;
            var num = parseInt(count/limit) + 1; //循环次数
            if (userUseTimeCount) { //已经扫描过
                console.log(userUseTimeCount)
                console.log(22222211)
            } else { //从未扫描过
                for (let i = 1; i <= num; i++) {
                    collection.aggregate({$progect : {phone_deviceId: 1,time: 1, mode: 1}},              
                    {$sort: {time: 1}},
                    {$skip: (i - 1) * limit},
                    {$limit: limit},    
                    {}
                    ).toArray(function (err, docs) {
                        console.log(2222222)
                        console.log(docs);
                            db.close();
                    })
                   
                }
            }
            
            // collection.aggregate({$group : {_id : "$phone_deviceId", count: {$sum: 1}, phone_position: {$first: '$phone_position'}, phone_type: {$first: '$phone_type'}, phone_version: {$first: '$phone_version'}, node: {$first: '$node'}, time: {$max: '$time'}}},{}).toArray((err,arr) => {
            //     console.log(params.isdownLoad)  
            //     if (params.isdownLoad) { //是否导出
            //         console.log(arr)  
            //                     callback(arr);
            //                     db.close();
            //                     return;
            //     }
                
            // })     
        });    
    }
}
upData.updataUserTime();
module.exports = upData