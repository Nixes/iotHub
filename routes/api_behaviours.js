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
    Behaviour.find().lean().exec({},function (err, behaviours) {
      if (err) return console.error(err);
      // replace the encoded conditions with the string versions
      for (let i = 0; i < behaviours.length; i++) {
        behaviours[i].condition = behaviour_helpers.ConditionalToString(behaviours[i].condition);
      }
      res.json(behaviours);
    });
})

// add a behaviour to the database
.post('/', function(req, res, next) {
  var behaviour = new Behaviour();
  behaviour.enabled = req.body.enabled;
  behaviour.description = req.body.description;
  behaviour.sensor = req.body.sensor;
  behaviour.actor = req.body.actor;
  behaviour.action = req.body.action;
  behaviour.condition = behaviour_helpers.StringToConditional(req.body.condition);
  behaviour.value = req.body.value;
  console.log("Tried to add a new behaviour: ");
  console.log(behaviour);

  // validate the behaviour using common rules
  if (behaviour_helpers.Validate(behaviour)) return;

  // handle issues with conversion
  behaviour.save(function(err,behaviour) {
    if (err) {
      console.error("Failed to add behaviour err: "+err);
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
      console.error("Behaviour not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Updating behaviour: ", behaviour._id);
      if (behaviour.enabled) behaviour.enabled = req.body.enabled;
      if (behaviour.description) behaviour.description = req.body.description;
      if (behaviour.behaviour) behaviour.behaviour = req.body.behaviour;
      if (behaviour.sensor) behaviour.sensor = req.body.sensor;
      if (behaviour.actor) behaviour.actor = req.body.actor;
      if (behaviour.condition) behaviour.condition = behaviour_helpers.StringToConditional(req.body.condition);
      if (behaviour.value) behaviour.value = req.body.value;
      console.log(" New description: "+behaviour.description );
      // handle issues with conversion
      behaviour.save(function(err,behaviour) {
        if (err) {
          console.error("Failed to update behaviour err: "+err);
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
  Behaviour.findById().lean().exec(req.params.behaviour_id,'-__v', function(err,behaviour){
    if (err) {
      console.error("Behaviour not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Retrieved Behaviour: ");
      console.log(JSON.stringify(behaviour) );
      behaviour.condition = behaviour_helpers.ConditionalToString(behaviour.condition);
      res.json(behaviour);
    }
  });
})

// delete an existing behaviour by Id
.delete('/:behaviour_id', function(req, res, next){
  Behaviour.findById(req.params.behaviour_id).remove().exec( function(err,behaviour){
    if (err) {
      console.error("Failed to delete behaviour err: "+err);
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
