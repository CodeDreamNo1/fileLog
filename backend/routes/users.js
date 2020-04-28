var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel')
var modeModel = require('../model/modeModel')
/* GET users listing. */
router.post('/', function(req, res, next) {
  // console.log(req)
  userModel.getFileJson(req.body, (data) => {
    // console.log(data);
    res.json(data);
  })
});
router.post('/clickInfo', function(req, res, next) { //获取用户点击模块
  userModel.getclickInfo(req.body, (data) => {
    res.json(data);
  })
});
router.post('/modeInfo', function(req, res, next) { //获取用户点击模块
  modeModel.getModeInfo(req.body, (data) => {
    res.json(data);
  })
});


module.exports = router;

