

const config = {
  MongoClient: require('mongodb').MongoClient,
  // url: "mongodb://localhost:27017",
  // database: 'file',
  // collection: 'test',
  url: "mongodb://novafiles_user:123456@dds-bp1fbee6363228e41642.mongodb.rds.aliyuncs.com:3717,dds-bp1fbee6363228e42114.mongodb.rds.aliyuncs.com:3717/novafiles?replicaSet=mgset-4767543",
  database: 'novafiles',
  collection: 'file',
  useNewUrlParser: true
}
console.log(process.env)
module.exports = config;