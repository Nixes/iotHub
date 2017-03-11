var mongoose = require( 'mongoose' );
var passportLocalMongoose = require('passport-local-mongoose');

// user account stored in DB, for authentication with passport
var account = mongoose.Schema({
    username: String,
    password: String
});
account.plugin(passportLocalMongoose); // register it with the passport plugin


var dataSchema = mongoose.Schema({
  sensor_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true},
  value: {type: mongoose.Schema.Types.Mixed,  required: true},
  collection_time: { type: Date, default: Date.now, required: true }
});

dataSchema.methods.itemAfter = function(time) {
  // parse date
  let tmp_date = new Date(this.collection_time);
  if ( tmp_date > time) {
    return true;
  } else {
    return false;
  }
};

// this will eventually become a package that is downloaded by the sensors to change device settings
var sensorSettingsSchema = mongoose.Schema({
  polling_time: Number,
});

var sensorSchema = mongoose.Schema({
  // don't need an id as mongodb creates one for us anyway
  name: String,
  description: String,
  data_type: String,
  data_period: String, // determines how long data should be kept before old points removed
  settings: sensorSettingsSchema
});

var actorSchema = mongoose.Schema({
  name: String,
  description: String,
  state_type: String, // the type of state, used for validation when set by the actor
  state: mongoose.Schema.Types.Mixed, // the current state of the actor
  last_seen_host: String, // the last known ip or hostname of the actor device
  last_seen_time: Date, // the date that the actor last interacted with the hub
});

var overviewSchema = mongoose.Schema({
  //user_id: // reference to user in user schema
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },// reference to the sensor to show
  time_period: String,
});

var behaviourSchema = mongoose.Schema({
  enabled: {type: Boolean,  required: true },
  description: String,// reference to the sensor to show
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },// reference to the sensor to show
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor', required: true },// reference to the sensor to show
  condition: {type: Number,  required: true },
  value: {type: mongoose.Schema.Types.Mixed,  required: true }, // value is what is compared against the state of the sensor
  action: {type: mongoose.Schema.Types.Mixed,  required: true },
});


// register as model to mongoose
mongoose.model('Sensor', sensorSchema);
mongoose.model('Actor', actorSchema);
mongoose.model('Data', dataSchema);
mongoose.model('Overview', overviewSchema);
mongoose.model('Behaviour', behaviourSchema);
mongoose.model('Account', account);
