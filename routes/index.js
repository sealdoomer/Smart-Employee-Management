var express = require('express');
var router = express.Router();
var path = require('path');
var multipart = require('connect-multiparty');
var fs = require("fs");
/* GET home page. */
router.get('/', function(req, res, next) {

  res.sendfile('index.html');
});


router.post('/files', multipart(), function(req, res){
  //get filename

  var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
  //copy file to a public directory
  var name = "";
  for (var i = 0; i < 10; i++) {
    name = name + String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  var targetPath = path.dirname(__filename) + '/../public/images/' + name;

  //copy file
  fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
  //return file url
  res.json({code: 200, imgPath: name});

});

module.exports = router;
