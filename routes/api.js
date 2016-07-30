var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

// include models
var Sensor = mongoose.model('Sensor');


var d = new Date(),
hour = d.getHours(),
min = d.getMinutes(),
month = d.getMonth(),
year = d.getFullYear(),
sec = d.getSeconds(),
day = d.getDate();

router
.get('/' ,function(req, res, next){
    res.send('Go read the api docs');
  }
)
// return a list of sensor ids and names
.get('/sensors', function(req, res, next) {
    Sensor.find({},'-data -__v',function (err, sensors) {
      if (err) return console.error(err);
      console.log(sensors);
      res.send(sensors);
    });
})

// add a sensor to the database
.post('/sensors/', function(req, res, next) {
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
  Sensor.findById(req.params.sensor_id,'-data -__v', function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      res.send(sensor);
    }
  });
})

// add sensor data to the database
.post('/sensors/:sensor_id/data',function(req, res, next){
  Sensor.findById(req.params.sensor_id, function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      var data;
      if (req.body.collection_time !== null) {
        data = {value: req.body.value,collection_time:req.body.collection_time};
      } else {
        data = {value: req.body.value};
      }
      sensor.data.push(data);
      sensor.save( function(err) {
        if (err) {
          console.log("Something broke: "+err);
          res.send({success:false});
        } else {
          res.send({success:true});
        }
      });
    }
  });
})

// return all data provided by the sensor with the given id
.get('/sensors/:sensor_id/data',function(req, res, next){
  Sensor.findById(req.params.sensor_id,"data", function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      res.send(sensor.data);
    }
  });
})

// good reference for time based data queries: http://stackoverflow.com/questions/17008683/doing-range-queries-in-mongoose-for-hour-day-month-year
// also, aggregation seems like a great idea: http://stackoverflow.com/questions/13452745/extract-subarray-value-in-mongodb
// return all data provided by the sensor with the given id within the last 24 hours
.get('/sensors/:sensor_id/data/day',function(req, res, next){
  Sensor.aggregate( { $match: { '_id':req.params.sensor_id } } ).unwind('data').exec(function(err,result) {
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      res.send(result);
    }
  });
})
;

module.exports = router;
