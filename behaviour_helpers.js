var mongoose = require( 'mongoose' );
var Behaviour = mongoose.model('Behaviour');

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

behaviour_helpers.ConditionalToEval = function (conditional, value, state) {
  return behaviour_helpers.condition_list_functions[conditional](value, state);
};

module.exports = behaviour_helpers;
