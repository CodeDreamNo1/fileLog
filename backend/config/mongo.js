

const config = {
  MongoClient: require('mongodb').MongoClient,
  // url: "mongodb://localhost:27017",
  // database: 'file',
  // collection: 'test',
 
  database: 'novafiles',
  collection: 'file',
  useNewUrlParser: true
}
console.log(process.env)
module.exports = config;