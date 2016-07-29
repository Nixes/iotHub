var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

// include models
var Sensor = mongoose.model('Sensor');


router
.get('/' ,function(req, res, next){
    res.send('Go read the api docs');
  }
)
// return a list of sensor ids and names
.get('/sensors', function(req, res, next) {
    res.send([
      {sensor_id:"54564",sensor_name:"something"},
      {sensor_id:"86689",sensor_name:"something else"},
      {sensor_id:"54453",sensor_name:"something even different"}
    ]);
})
// add a sensor to the database
.post('/sensors/:sensor_id/', function(req, res, next) {
  var sensor = new Sensor();
  //sensor.id = req.params.sensor_id;
  console.log("Tried to add a new sensor");
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
