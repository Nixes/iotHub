var mongoose = require( 'mongoose' );
var Behaviour = mongoose.model('Behaviour');
var Actor = mongoose.model('Actor');

var behaviour_helpers = {};

// this entire module is designed to allow the
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

behaviour_helpers.EvaluateConditional = function (conditional, value, state) {
  return behaviour_helpers.condition_list_functions[conditional](value, state);
};

// run an action as found in a behaviour, TODO: Complete
behaviour_helpers.PerformAction = function (action, actor) {
  console.log("Action " + action + " to be performed by "+actor);
};

behaviour_helpers.Validate = function (behaviour){
  // check that number of the conditional type is within available options
  if (behaviour.condition > behaviour_helpers.condition_list_functions.length) {return false;}

  return true;
};

behaviour_helpers.CheckBehaviour = function(sensor_id,last_sensor_state) {
  Behaviour.find({sensor:sensor_id}).lean().exec( function(err,data){
    if (err) {
      console.log("Unable to find matching behaviour");
      return;
    } else {
      console.log("Found a matching behaviour, validating");
      console.log("Actor found within was: ");
      console.log(data.actor);
      // validate the behaviour first
      if (behaviour_helpers.Validate(data)) {
        console.log("Passed, testing");
        if (behaviour_helpers.EvaluateCondition(data.condition,data.value,last_sensor_state) ) {
          console.log("Passed, running action");
          behaviour_helpers.PerformAction(data.action,data.actor);
        }
      }
    }
  });
};


module.exports = behaviour_helpers;
