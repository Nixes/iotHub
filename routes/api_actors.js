var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var request = require('request'); // request api is required for sending posts to the actors internal server

// include models
var Actor = mongoose.model('Actor');
var Data = mongoose.model('Data');
var Overview = mongoose.model('Overview');

// this function is called everytime a new actor state is received
function updateActorState(actor,req,res){
  if (actor.state == req.body.state) return; // only process when something changed
  // TODO: check that received state type matches the state_type of the model

  // change the state of the actor itself
  request.post('http://' + actor.last_seen_host + '/actor/' + actor._id + '',{ json: {state:req.body.state} }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);

      // if all goes well then update the db with the new state
      console.log("Updating actor " + actor._id + " state to " + req.body.state );
      actor.state = req.body.state;
      // handle issues with conversion
      actor.save(function(err,actor) {
        if (err) {
          console.log("Failed to update local actor state err: "+err);
          res.status(404).json({success:false});
        } else {
          res.json({success:true, request:req.body });
        }
      });
    } else {
      console.log("Failed to update remote actor state");
      res.status(404).json({success:false});
    }
  });
}

// this function should be run everytime the actor interacts with the hub
function actorInteraction(actor_id) {
  checkActorExists(actor_id, function() {
    actor.last_seen_time = new Date();
    actor.save(function(err,actor) {
      if (err) {
        console.log("Failed to update last seen time err: "+err);
        res.json({success:false});
      } else {
        res.json({success:true});
      }
    });
  });
}

// shared functions
function checkActorExists(actor_id,callback,res) {
  Actor.findById(actor_id, function(err,actor){
    if (err || !actor) {
      console.log("Actor not registered err: "+err);
      if (res) res.status(404).json({success:false,error:"Actor not registered"});
    } else {
      callback(actor);
    }
  });
}

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
  console.log("Tried to add a new actor: " + actor.id + ", name: " +actor.name + ", description: " +actor.description );

  // handle issues with conversion
  actor.save(function(err,actor) {
    if (err) {
      console.log("Failed to add actor err: "+err);
      res.json({success:false});
    } else {
      actorInteraction(actor._id)
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
      actor.name = req.body.name;
      actor.description = req.body.description;
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
  checkActorExists(req.params.actor_id,function (actor) {
    actorInteraction(actor._id)
    updateActorState(actor,req,res);
  },res);
})

// if none of these, 404
.get('*', function(req, res){
  res.status(404).send("No endpoint found");
})
;

module.exports = router;
