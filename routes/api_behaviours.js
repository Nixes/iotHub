var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var behaviour_helpers = require('../behaviour_helpers'); // add helpers for conditional support

// include models
var Sensor = mongoose.model('Sensor');
var Data = mongoose.model('Data');
var Overview = mongoose.model('Overview');
var Behaviour = mongoose.model('Behaviour');


router

// return a list of behaviours
.get('/', function(req, res, next) {
    Behaviour.find({},function (err, behaviours) {
      if (err) return console.error(err);
      console.log(behaviours);
      res.json(behaviours);
    });
})

// add a behaviour to the database
.post('/', function(req, res, next) {
  console.log("Adding a new behaviour");
  var behaviour = new Behaviour();
  behaviour.enabled = req.body.enabled;
  behaviour.description = req.body.description || undefined;
  behaviour.behaviour = req.body.behaviour;
  behaviour.sensor = req.body.sensor;
  behaviour.actor = req.body.actor;
  behaviour.condition = behaviour_helpers.StringToConditional(req.body.condition);
  behaviour.value = req.body.value;
  console.log("Tried to add a new behaviour: " + behaviour.id + ", description: " +behaviour.description );

  // handle issues with conversion
  behaviour.save(function(err,behaviour) {
    if (err) {
      console.log("Failed to add behaviour err: "+err);
      res.status(404).json({success:false});
    } else {
      res.json({success:true, id:behaviour.id});
    }
  });
})

// update an existing behaviour based on its id
.post('/:behaviour_id', function(req, res, next) {

  Behaviour.findById(req.params.behaviour_id, function(err,behaviour){
    if (err) {
      console.log("Behaviour not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Updating behaviour: ", behaviour._id);
      behaviour.enabled = req.body.enabled;
      behaviour.description = req.body.description;
      behaviour.behaviour = req.body.behaviour;
      behaviour.actor = req.body.actor;
      behaviour.condition = behaviour_helpers.StringToConditional(req.body.condition);
      behaviour.value = req.body.value;
      console.log(" New description: "+behaviour.description );
      // handle issues with conversion
      behaviour.save(function(err,behaviour) {
        if (err) {
          console.log("Failed to update behaviour err: "+err);
          res.json({success:false});
        } else {
          res.json({success:true, request:req.body });
        }
      });
    }
  });
})

// get information about a specific behaviour
.get('/:behaviour_id', function(req, res, next){
  Behaviour.findById(req.params.behaviour_id,'-__v', function(err,behaviour){
    if (err) {
      console.log("Behaviour not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Retrieved Behaviour: ");
      console.log(JSON.stringify(behaviour) );
      res.json(behaviour);
    }
  });
})

// delete an existing behaviour by Id
.delete('/:behaviour_id', function(req, res, next){
  Behaviour.findById(req.params.behaviour_id).remove().exec( function(err,behaviour){
    if (err) {
      console.log("Failed to delete behaviour err: "+err);
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
