var config = require('../config/ossConfig');
var getUserList = require('./read').getUserList; //拉取云端目录
getUserList({'server': config.oss_eu});