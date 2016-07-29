var mongoose = require( 'mongoose' );

var dataSchema = mongoose.Schema({
  value: mongoose.Schema.Types.Mixed, // mixed might be the wrong type for this
  collection_time: { type: Date, default: Date.now }
});

// create schema
var sensorSchema = mongoose.Schema({
    id:  mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    data_type: String,
    data: [dataSchema]
});

// register as model to mongoose
mongoose.model('Sensor', sensorSchema);
