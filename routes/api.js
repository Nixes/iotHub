var express = require('express');
var router = express.Router();

router
.get('/' ,function(req, res, next){
    res.send('Go read the api docs');
  }
)
// return a list of sensor ids
.get('/sensors', function(req, res, next) {
    res.send([
      {sensor_id:"54564",sensor_name:"something"},
      {sensor_id:"86689",sensor_name:"something else"},
      {sensor_id:"54453",sensor_name:"something even different"}
    ]);
})
// add a sensor to the database
.post('/sensors/:sensor_id', function(req, res, next) {

  // if added to database, say so
  res.send({success:true});
})
// get information about a specific sensor
.get('/sensors/:sensor_id/', function(req, res, next){
  res.send({sensor_id:req.params.sensor_id, sensor_name: 'name'});
})
// add sensor data to the database
.post('/sensors/:sensor_id/data',function(){
  res.send({sensor_id:req.params.sensor_id, sensor_name: 'name'});
})
;

module.exports = router;
