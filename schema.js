var mongoose = require( 'mongoose' );

var dataSchema = mongoose.Schema({
  value: Number, // mongoose.Schema.Types.Mixed might be the wrong type for this
  collection_time: { type: Date, default: Date.now, required: true }
});

dataSchema.methods.itemAfter = function(time) {
  // parse date
  let tmp_date = new Date(this.collection_time);
  //console.log(tmp_date.toDateString());
  if ( tmp_date > time) {
    //console.log("Passed");

    return true;
  } else {
    return false;
  }
}

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

// returns a subset of data from that passed in that has timestamps after the time specified
sensorSchema.methods.dataAfter = function ( time) {
  let final_data = [];
  let len = this.data.length;
  for (let i = 0; i < len; i++) {
    if (this.data[i].itemAfter(time) ) {
          final_data.push(this.data[i]);
    }
  }
  return final_data;
}

// TODO optimisation: assume data is ordered, so when we find the first element that fails the check we should stop searching
sensorSchema.methods.filterData = function (filter_date_string) {
  console.log("A filter data query just got run");

  let today = new Date();
  let compare_date;

  // determine type of filter date, and calculate time period
  if (filter_date_string === "hour") {
    compare_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getDay(), today.getHours() - 1);
  }
  if (filter_date_string === "day") {
    compare_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getDay() - 1);
  }
  if (filter_date_string === "week") {
    compare_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  }
  if (filter_date_string === "month") {
    compare_date = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  }
  if (filter_date_string === "sixmonth") {
    compare_date = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  }

  console.log("Today: "+ today.toDateString());

  // benchmark both filter methods on same data
  console.time('dataAfter');
  let final_data = this.dataAfter(compare_date)
  console.timeEnd('dataAfter');

  //console.time('dataAfterNFilter');
  //let final_data_nf = this.dataAfterNFilter(compare_date)
  //console.timeEnd('dataAfterNFilter');


  return final_data; // return data from thread
};



var overviewSchema = mongoose.Schema({
  //user_id: // reference to user in user schema
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },// reference to the sensor to show
  time_period: String,
});

// register as model to mongoose
mongoose.model('Sensor', sensorSchema);
mongoose.model('Data', dataSchema);
mongoose.model('Overview', overviewSchema);
