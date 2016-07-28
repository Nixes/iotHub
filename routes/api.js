var express = require('express');
var router = express.Router();

router
.get('/', function(req, res, next) {
    res.send('respond with some data from the server');
  }
)
// post sensor data to server
.post('/', function(req, res, next) {
    res.send('you sent some data to the server, which was promptly ignored');
  }
);

module.exports = router;
