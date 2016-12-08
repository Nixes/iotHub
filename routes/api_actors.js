var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

// include models
var Sensor = mongoose.model('Sensor');
var Actor = mongoose.model('Actor');
var Data = mongoose.model('Data');
var Overview = mongoose.model('Overview');

// shared functions
function checkActorExists(res,sensor_id,callback) {
  Actor.findById(sensor_id, function(err,actor){
    if (err || !actor) {
      console.log("Actor not registered err: "+err);
      res.status(404).json({success:false,error:"Actor not registered"});
    } else {
      callback(sensor._id);
    }
  });
}

router

// return a list of sensor ids and names
.get('/', function(req, res, next) {
    Actor.find({},function (err, actors) {
      if (err) return console.error(err);
      console.log(actors);
      res.json(actors);
    });
})

// add a sensor to the database
.post('/', function(req, res, next) {
  var actor = new Actor();
  actor.name = req.body.name || "default name";
  actor.description = req.body.description || undefined;
  console.log("Tried to add a new actor: " + actor.id + ", name: " +actor.name + ", description: " +actor.description );

  // handle issues with conversion
  actor.save(function(err,actor) {
    if (err) {
      console.log("Failed to add sensor err: "+err);
      res.json({success:false});
    } else {
      res.json({success:true, id:actor.id});
    }
  });
})

// update an existing sensor based on an id
.post('/:actor_id', function(req, res, next) {

  Actor.findById(req.params.actor_id, function(err,sensor){
    if (err) {
      console.log("Actor not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Updating sensor: ", sensor._id);
      actor.name = req.body.name;
      actor.description = req.body.description;
      console.log(" New actor name: "+actor.name + " description: "+actor.description );
      // handle issues with conversion
      actor.save(function(err,actor) {
        if (err) {
          console.log("Failed to update actor err: "+err);
          res.json({success:false});
        } else {
          res.json({success:true, request:req.body });
        }
      });
    }
  });
})

// get information about a specific sensor
.get('/:actor_id', function(req, res, next){
  Actor.findById(req.params.actor_id,'-__v', function(err,sensor){
    if (err) {
      console.log("Actor not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Retrieved Actor: ");
      console.log(JSON.stringify(sensor) );
      res.json(sensor);
    }
  });
})

// delete an existing sensor by Id
.delete('/:actor_id', function(req, res, next){
  Actor.findById(req.params.actor_id).remove().exec( function(err,sensor){
    if (err) {
      console.log("Failed to delete actor err: "+err);
      res.json({success:false});
    } else {
      res.json({success:true});
    }
  });
})

// if none of these, 404
.get('*', function(req, res){
  res.status(404).send("No endpoint found");
})
;

module.exports = router;
