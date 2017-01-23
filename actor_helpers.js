var mongoose = require( 'mongoose' );
var request = require('request'); // request api is required for sending posts to the actors internal server
var Actor = mongoose.model('Actor');

var actor_helpers = {};

actor_helpers.CheckActorExists = function(actor_id,callback,res) {
  Actor.findById(actor_id, function(err,actor){
    if (err || !actor) {
      console.log("Actor not registered err: "+err);
      if (res) res.status(404).json({success:false,error:"Actor not registered"});
    } else {
      callback(actor);
    }
  });
};

// this function should be run everytime the actor interacts with the hub
actor_helpers.ActorInteraction = function(actor_id, res) {
  console.log("An interaction with an actor just occured");
  actor_helpers.CheckActorExists(actor_id, function(actor) {
    actor.last_seen_time = new Date();
    actor.save(function(err,actor) {
      if (err) {
        console.log("Failed to update last seen time err: "+err);
        if (res) res.json({success:false});
      } else {
        if (res) res.json({success:true});
      }
    });
  });
};

actor_helpers.PerformAction = function (actor, action, res) {
  if (actor.state === action) {
    console.log("No change detected");
    if (res) res.status(404).json({success:false});
    return;
  }; // only process when something changed
  // TODO: check that received state type matches the state_type of the model

  // change the state of the actor itself
  request.post('http://' + actor.last_seen_host + '/actor/' + actor._id + '',{ json: {state:action} }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);

      // if all goes well then update the db with the new state
      console.log("Updating actor " + actor._id + " state to " + req.body.state );
      actor.state = action;
      // handle issues with conversion
      actor.save(function(err,actor) {
        if (err) {
          console.log("Failed to update local actor state err: "+err);
          if (res) res.status(404).json({success:false});
        } else {
          if (res) res.json({success:true});
        }
      });
    } else {
      console.log("Failed to update remote actor state, error: "+error);
      if (res) res.status(404).json({success:false});
    }
  });
};

actor_helpers.Validate = function (actor){

  return true;
};



module.exports = actor_helpers;
