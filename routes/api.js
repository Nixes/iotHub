var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

// include models
var Sensor = mongoose.model('Sensor');
var Data = mongoose.model('Data');
var Overview = mongoose.model('Overview');

router
.get('/' ,function(req, res, next){
    res.send('Go read the api docs');
  }
)


// return a list of all items set to show in the overview
.get('/overview' ,function(req, res, next){
  Overview.find({}).populate('sensor').exec( function (err, overview) {
    if (err) {
      console.log("found no sensors with overviews");
      res.status(404).json({success:false});
    } else {
      res.json(overview);
    }
  });
})

.post('/overview' ,function(req, res, next){
  var overview = new Overview();
  overview.sensor = req.body.sensor;

  // handle issues with conversion
  overview.save(function(err,sensor) {
    if (err) {
      console.log("Failed to add overview err: "+err);
      res.json({success:false});
    } else {
      res.json({success:true});
    }
  });
})

// return the listing of a given sensor_id's overview document
.get('/overview/:sensor_id' ,function(req, res, next){
  Overview.find({sensor: req.params.sensor_id}, function(err,overview){
    if (err) {
      console.log("Failed to find overview for "+req.params.sensor_id+" err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Got overview");
      res.json(overview[0]);
    }
  });
})

// remove overview listing by sensor_id it applies to
.delete('/overview/:sensor_id' ,function(req, res, next){
  Overview.find({sensor: req.params.sensor_id}).remove().exec( function(err){
    if (err) {
      console.log("Failed to remove overview for "+req.params.sensor_id+" err: "+err);
      res.json({success:false});
    } else {
      res.json({success:true});
    }
  });
})
;

module.exports = router;
