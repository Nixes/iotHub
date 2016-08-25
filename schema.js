var mongoose = require( 'mongoose' );

var dataSchema = mongoose.Schema({
  value: Number, // mongoose.Schema.Types.Mixed might be the wrong type for this
  collection_time: { type: Date, default: Date.now, required: true }
});

// this will eventually become a package that is downloaded by the sensors to change device settings
var SensorSettingsSchema = mongoose.Schema({
  polling_time: Number,
});

var sensorSchema = mongoose.Schema({
    // don't need an id as mongodb creates one for us anyway
    name: String,
    description: String,
    data_type: String,
    data_period: String, // determines how long data should be kept before old points removed
    settings: SensorSettingsSchema,
    data: [dataSchema]
});

var overviewSchema = mongoose.Schema({
  //user_id: // reference to user in user schema
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },// reference to the sensor to show
  time_period: String,
});

// register as model to mongoose
mongoose.model('Sensor', sensorSchema);
mongoose.model('Data', dataSchema);
mongoose.model('Overview', overviewSchema);
