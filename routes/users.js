var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET users listing. */
router.get('/list', function(req, res, next) {
  fs.readFile( __dirname + "/../" + "employees.json", 'utf8', function (err, data) {
    res.end( data );
  });
});

router.get('/info/:id', function (req, res) {
  fs.readFile( __dirname + "/../" + "employees.json", 'utf8', function (err, data) {
    var employees = JSON.parse(data);
    var employee= employees[req.params.id]
    res.end(JSON.stringify(employee));
  });
});

router.post('/create', function (req, res) {
  fs.readFile( __dirname + "/../" + "employees.json", 'utf8', function (err, data) {
    var newEmployee = req.body;
    data = JSON.parse( data );
    var length = Object.keys(data).length + 1;
    newEmployee["uid"] = length + "";
    data[length + ""] = newEmployee;
    fs.writeFile(__dirname + '/../employees.json', JSON.stringify(data), function(err,data){
      res.json({uid: length});
    });

  });

});

router.put('/edit', function (req, res) {
  console.log(req.body.uid)
  fs.readFile( __dirname + "/../" + "employees.json", 'utf8', function (err, data) {
    var newEmployee = req.body;
    data = JSON.parse( data );
    data[req.body.uid] = newEmployee;
    fs.writeFile(__dirname + '/../employees.json', JSON.stringify(data), function(err,data){
      res.json({uid: req.body.uid});
    });

  });
})


module.exports = router;
