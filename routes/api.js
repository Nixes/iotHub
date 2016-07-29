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
    Sensor.find(function (err, sensors) {
      if (err) return console.error(err);
      console.log(sensors);
      res.send(sensors);
    });
})
// add a sensor to the database
.post('/sensors/:sensor_id/', function(req, res, next) {
  var sensor = new Sensor();
  sensor.name = req.body.name;
  sensor.description = req.body.description;
  console.log("Tried to add a new sensor: " + sensor.id + ", name: " +sensor.name + ", description: " +sensor.description );

  // handle issues with conversion
  sensor.save(function(err,sensor) {
    if (err) {
      console.log("Failed to add sensor err: "+err);
      res.send({success:false});
    } else {
      res.send({success:true, id:sensor.id});
    }
  });

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
