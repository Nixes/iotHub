var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var actor_helpers = require('../actor_helpers'); // add helpers for conditional support

// include models
var Actor = mongoose.model('Actor');
var Data = mongoose.model('Data');
var Overview = mongoose.model('Overview');


router

// return a list of actor ids and names
.get('/', function(req, res, next) {
    Actor.find({},function (err, actors) {
      if (err) return console.error(err);
      console.log(actors);
      res.json(actors);
    });
})

// add a actor to the database
.post('/', function(req, res, next) {
  var actor = new Actor();
  actor.name = req.body.name || "default name";
  actor.description = req.body.description || undefined;
  actor.last_seen_time = new Date();
  actor.state_type = req.body.state_type;
  console.log("Tried to add a new actor: " + actor.id + ", name: " +actor.name + ", description: " +actor.description );

  // handle issues with conversion
  actor.save(function(err,actor) {
    if (err) {
      console.log("Failed to add actor err: "+err);
      res.json({success:false});
    } else {
      actor_helpers.ActorInteraction(actor._id,req);
      res.json({success:true, id:actor._id});
    }
  });
})

// update an existing actor based on an id
.post('/:actor_id', function(req, res, next) {

  Actor.findById(req.params.actor_id, function(err,actor){
    if (err) {
      console.log("Actor not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Updating actor: ", actor._id);
      if (req.body.name) actor.name = req.body.name;
      if (req.body.description) actor.description = req.body.description;
      if (req.body.state_type) actor.state_type = req.body.state_type;
      console.log(" New actor name: "+actor.name + " description: "+actor.description );
      // handle issues with conversion
      actor.save(function(err,actor) {
        if (err) {
          console.log("Failed to update actor err: "+err);
          res.status(404).json({success:false});
        } else {
          res.json({success:true, request:req.body });
        }
      });
    }
  });
})

// get information about a specific actor
.get('/:actor_id', function(req, res, next){
  Actor.findById(req.params.actor_id,'-__v', function(err,actor){
    if (err) {
      console.log("Actor not registered err: "+err);
      res.status(404).json({success:false});
    } else {
      console.log("Retrieved Actor: ");
      console.log(JSON.stringify(actor) );
      res.json(actor);
    }
  });
})

// delete an existing actor by Id
.delete('/:actor_id', function(req, res, next){
  Actor.findById(req.params.actor_id).remove().exec( function(err,actor){
    if (err) {
      console.log("Failed to delete actor err: "+err);
      res.json({success:false});
    } else {
      res.json({success:true});
    }
  });
})

// update the value of the actor (for if the actors state changed without being requested (manually overridden) )
.post('/:actor_id/state', function(req, res, next) {
  console.log("Tried to update actor state");
  actor_helpers.CheckActorExists(req.params.actor_id,function (actor) {
    actor_helpers.ActorInteraction(actor._id);
    actor_helpers.PerformAction(actor,req.body.state,res);
  },res);
})

// if none of these, 404
.get('*', function(req, res){
  res.status(404).send("No endpoint found");
})
;

module.exports = router;
