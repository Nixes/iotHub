var mongoose = require( 'mongoose' );
var Behaviour = mongoose.model('Behaviour');
var Actor = mongoose.model('Actor');
var actor_helpers = require('./actor_helpers'); // add helpers to allow us to perform an action

var behaviour_helpers = {};

// this entire module is designed to allow the execution of behaviours by any other part of the hub

behaviour_helpers.condition_list_string = [
  "equal",
  "not equal",
  "greater",
  "less",
  "greater or equal",
  "less or equal",
];

behaviour_helpers.condition_list_functions = [
  // equal
  function (value, state) {
    if (state === value) {
      return true;
    }
    return false;
  },
  // not equal
  function (value, state) {
    if (state !== value) {
      return true;
    }
    return false;
  },
  // greater
  function (value, state) {
    if (state > value) {
      return true;
    }
    return false;
  },
  // less
  function (value, state) {
    if (state < value) {
      return true;
    }
    return false;
  },
  // greater or equal
  function (value, state) {
    if (state >= value) {
      return true;
    }
    return false;
  },
  // less or equal
  function (value, state) {
    if (state <= value) {
      return true;
    }
    return false;
  },
];

// takes in a string in the format above
behaviour_helpers.StringToConditional = function (string) {
  for (i=0; i < behaviour_helpers.condition_list_string.length; i++) {
    if (string === behaviour_helpers.condition_list_string[i]) {
      return i;
    }
  }
};

behaviour_helpers.ConditionalToString = function (condition_num) {
  return behaviour_helpers.condition_list_string[condition_num];
};

behaviour_helpers.EvaluateCondition = function (conditional, value, state) {
  console.log("Conditional was: "+ behaviour_helpers.ConditionalToString(conditional) + " as int: " + conditional);
  return behaviour_helpers.condition_list_functions[conditional](value, state);
};

// run an action as found in a behaviour, TODO: Complete
behaviour_helpers.PerformAction = function (actor_id, action) {
  Actor.findById(actor_id, function(err,actor){
    if (err || !actor) {
      console.error("Could not find actor to perform action on");
    } else {
      actor_helpers.PerformAction(actor, action);
    }
  });
};

behaviour_helpers.Validate = function (behaviour){
  // check that number of the conditional type is within available options
  if (behaviour.condition > behaviour_helpers.condition_list_functions.length) {
    console.log("Behaviour had an incorrect condition value");
    return false;
  }

  // test that the behaviour action type is the same type as the actor state_type
  if ( typeof(behaviour.action) !==  behaviour.actor.state_type) {
    console.log("Typof action: "+ typeof(behaviour.action));
    console.log("Action state_type: "+ behaviour.actor.state_type);
    console.log("Actor state_type did not match action type");
    return false;
  }

  // test that the type of value is the same as the data_type of sensor
  if ( typeof(behaviour.value) !==  behaviour.sensor.data_type) {
    console.log("Sensor data_type did not match value type");
    return false;
  }

  return true;
};

behaviour_helpers.CheckBehaviour = function(sensor_id,last_sensor_state) {
  Behaviour.find({sensor:sensor_id}).lean().populate('actor').populate('sensor').exec( function(err,behaviours){
    if (err || behaviours.length === 0) {
      console.log("Unable to find matching behaviour: " + err + "data was: ");
      console.log(behaviours);
      return;
    } else {
      for (let behaviour of behaviours) {
        console.log("Behaviour was: ");
        console.log(behaviour);
        console.log("Found a matching behaviour, validating");
        // validate the behaviour first
        if (behaviour_helpers.Validate(behaviour)) {
          console.log("Passed, testing");
          if (behaviour_helpers.EvaluateCondition(behaviour.condition,behaviour.value,last_sensor_state) ) {
            console.log("Passed, running action");
            behaviour_helpers.PerformAction(behaviour.actor._id, behaviour.action);
          }
        }
      }
    }
  });
};


module.exports = behaviour_helpers;
