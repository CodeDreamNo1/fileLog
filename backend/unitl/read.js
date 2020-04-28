var AdmZip = require('adm-zip');
var unitlModel = require('../model/unitlModel')
var fs = require('fs');
var oss = require('ali-oss');
var fxp = require("fast-xml-parser"); //xml转json
var config = {
   timeInt: 6, //此配置是扫描多久之前的目录（以当前时间为基准单位是小时） 注文件量过大的话需调低此时长
   localUrl: '../public/zip/',  //更改此路径注意删除文件操作
   server: {
    region: 'oss-cn-hangzhou',
    bucket: 'care-t',
    accessKeyId: 'eMYWoIbIam9NsYRC',
    accessKeySecret: 'auITylIEoV5R0fJHojCkfYzESrSk7g'
   },
   listConfig: {
    'delimiter':'/', //配置了该项只扫当前目录下的文件
    'prefix': 'ViPlex-Handy/', //配置了该项扫描特定目录下的文件
    'max-keys': '1000'
   }
}
var getUserList = function(configs) { //获取文件路径
   config = Object.assign(config, configs);
   let client =new oss(config.server);
   let times = getYestDayTime();
   client.list(config.listConfig).then((result) => {
       const json = fxp.parse(result.res.data.toString()).ListBucketResult.CommonPrefixes; //返回结果是xml需要转换json
       if (!json) {console.log('err:暂无目录'); return;}
       for (let i in json) { //遍历设备目录
           if (json[i].Prefix == "ViPlex-Handy//") continue; //第一个对象可能为空
            let s = json[i].Prefix
            //client.list({prefix: s, 'max-keys': 1000, marker: s + "1570612496525.json.zip"}).then((results) => { //获取昨天之后今天上传的最新文件
                client.list({'prefix': s, 'max-keys': '1000', 'marker': s + times + 'json.zip'}).then((results) => { //获取昨天之后今天上传的最新文件
                     const jsons = fxp.parse(results.res.data.toString()); //返回结果是buffer需要转字符串的xml, xml需要转换json
                     if (jsons.ListBucketResult && jsons.ListBucketResult.Contents.length) {
                         return new Promise((resolve) => {
                            console.log('开始下载文件....')
                            resolve(jsons.ListBucketResult.Contents)
                         })   
                     } else {
                        console.log(json[i].Prefix + '目录暂无文件')
                     }
                   }).then((res) => {
                   unload(res); //开始下载  
                   });
       }
   });
}
var getYestDayTime = function() {
   var today = new Date();
   today.setHours(0);
   today.setMinutes(0);
   today.setSeconds(0);
   today.setMilliseconds(0);
   var y = today - (1000 * 60 * 60 * 24);
   return y;
}
var read = function (paths){ //读取某个文件夹下json
    paths = paths ? paths : config.localUrl + config.server.bucket + '/'
    var con = [];
    fs.readdir(paths, function(err, files) {
        const txtFiles = files.filter(el => /\.zip$/.test(el))
        for (var i = 0; i < txtFiles.length; i++) {
            var zip = new AdmZip(paths + txtFiles[i]);
            var zipEntries = zip.getEntries();
            zipEntries.forEach(function(zipEntry) {
                if (zipEntry.isDirectory == false){
                    try {
                        var data = JSON.parse(zipEntry.getData().toString('utf8'));
                        for(var j in data.track) {
                            data.track[j].forEach((item) => {
                                var o = Object.create(null);
                                o.phone_deviceId = data.phone_deviceId;
                                o.mode = j;
                                o.phone_position = data.phone_position;
                                o.phone_type = data.phone_type;
                                o.phone_version = data.phone_version;
                                o.time = item;
                                o.node = config.server.bucket;
                                con.push(o)
                            })  
                        }   
            
                    } catch(e) {
                        console.log('error：'+e);
                        return false;
                    }
                }
            });
        }
        // console.log('下载的内容拿到啦:' + JSON.stringify(con))    
        ///文件读取完成开始整理数据  
        unitlModel.insertFileJson(con, (res) => { //存入mogo
            if (res.result.ok == 1) {
                console.log('共（' + res.result.n + '）条数据存储成功');
            } else {
                console.log('数据存储失败');
            }
           console.log(res)
        })
        //文件删除优化  
        deleteFile(); //优化删除已读取文件
        return con
    })
}
var deleteFile = function() {
    let files = [];
    if(fs.existsSync(config.localUrl + config.server.bucket + '/')){ //
        files = fs.readdirSync(config.localUrl + config.server.bucket + '/');
        files.forEach((file, index) => {
            fs.unlinkSync(config.localUrl + config.server.bucket + '/' + file); //删除文件 
        });
    }
} 
var t;
// read();
var unload = function(json) { //下载文件
    if (!json) return; //文件不存在的情况
    clearTimeout(t);
    let client = new oss(config.server);
    let info;
    if (json instanceof Array && json.length) { //说明有多个包
        try {
            json.forEach((item, index) => {
            info = client.get(item.Key, config.localUrl + config.server.bucket + '/' + item.Key.split('/')[2]);
            }) 
        }catch (e) {
            console.log(e);
            console.log(info);
        }
    } else {
       info = client.get(json.Key, config.localUrl + config.server.bucket + '/')
    }
    t = setTimeout(function() {
      read() //开始读取
    }, 60000)
}
module.exports = {read, unload, getUserList, deleteFile}