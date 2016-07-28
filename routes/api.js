var express = require('express');
var router = express.Router();

router
.get('/' ,function(req, res, next){
    res.send('Go read the api docs');
  }
)
.get('/sensor', function(req, res, next) {
    res.send('return some information about the given sensor');
  }
)
// post sensor data to server
.post('/sensor', function(req, res, next) {
    res.send('you sent something about a particular sensor');
  }
);

module.exports = router;
