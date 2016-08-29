var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );

// include models
var Sensor = mongoose.model('Sensor');
var Data = mongoose.model('Data');
var Overview = mongoose.model('Overview');

function itemAfter(item,time) {
  // parse date
  let tmp_date = new Date(item.collection_time);
  //console.log(tmp_date.toDateString());

  if ( tmp_date > time) {
    //console.log("Passed");

    return true;
  } else {
    return false;
  }
}

// returns a subset of data from that passed in that has timestamps after the time specified
function dataAfter(data, time) {
  let final_data = [];
  let len = data.length;
  for (let i = 0; i < len; i++) {
    if (itemAfter(data[i],time)) {
          final_data.push(data[i]);
    }
  }
  return final_data;
}


// TODO optimisation: assume data is ordered, so when we find the first element that fails the check we should stop searching
function filterData(data, filter_date_string) {
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
  return dataAfter(data,compare_date);
}

// this function should take in a large amount of data and return averages optimised for the number of points visible on the client device
function decimateData(data,number_points) {
  let data_length = data.length;
  let multiples_over = Math.floor(data_length / number_points);
  let averaged_data = [];

  for (let i = 0; i < number_points; i++) {
    let point_average;
    for(let j = 0; i < multiples_over; j++) {
      point_average+= data[i+j];
    }
    averaged_data.push(point_average / multiples_over);
  }
  return averaged_data;
}


router
.get('/' ,function(req, res, next){
    res.send('Go read the api docs');
  }
)

// return a list of all items set to show in the overview
.get('/overview' ,function(req, res, next){
  Overview.find({}).populate('sensor').exec( function (err, overview) {
    if (err) {
      console.log("found no sensors with overviews");
      res.send({success:false});
    } else {
      res.send(overview);
    }
  });
})

.post('/overview' ,function(req, res, next){
  var overview = new Overview();
  overview.sensor = req.body.sensor;

  // handle issues with conversion
  overview.save(function(err,sensor) {
    if (err) {
      console.log("Failed to add overview err: "+err);
      res.send({success:false});
    } else {
      res.send({success:true});
    }
  });
})

// return the listing of a given sensor_id's overview document
.get('/overview/:sensor_id' ,function(req, res, next){
  Overview.find({sensor: req.params.sensor_id}, function(err,overview){
    if (err) {
      console.log("Failed to find overview for "+req.params.sensor_id+" err: "+err);
      res.send({success:false});
    } else {
      console.log("Got overview");
      res.send(overview[0]);
    }
  });
})

// remove overview listing by sensor_id it applies to
.delete('/overview/:sensor_id' ,function(req, res, next){
  Overview.find({sensor: req.params.sensor_id}).remove().exec( function(err){
    if (err) {
      console.log("Failed to remove overview for "+req.params.sensor_id+" err: "+err);
      res.send({success:false});
    } else {
      res.send({success:true});
    }
  });
})

// return a list of sensor ids and names
.get('/sensors', function(req, res, next) {
    Sensor.find({},'-data -__v',function (err, sensors) {
      if (err) return console.error(err);
      console.log(sensors);
      res.send(sensors);
    });
})

// add a sensor to the database
.post('/sensors', function(req, res, next) {
  var sensor = new Sensor();
  sensor.name = req.body.name || "default name";
  sensor.description = req.body.description || undefined;
  console.log("Tried to add a new sensor: " + sensor.id + ", name: " +sensor.name + ", description: " +sensor.description );

  // handle issues with conversion
  sensor.save(function(err,sensor) {
    if (err) {
      console.log("Failed to add sensor err: "+err);
      res.send({success:false});
    } else {
      res.send({success:true, id:sensor.id});
    }
  });
})

// update an existing sensor based on an id
.post('/sensors/:sensor_id/', function(req, res, next) {

  Sensor.findById(req.params.sensor_id,'-data -__v', function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      sensor.name = req.body.name;
      sensor.description = req.body.description;
      // handle issues with conversion
      sensor.save(function(err,sensor) {
        if (err) {
          console.log("Failed to update sensor err: "+err);
          res.send({success:false});
        } else {
          res.send({success:true, request:req.body });
        }
      });
    }
  });
})

// get information about a specific sensor
.get('/sensors/:sensor_id/', function(req, res, next){
  Sensor.findById(req.params.sensor_id,'-data -__v', function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      res.send(sensor);
    }
  });
})

// delete an existing sensor by Id
.delete('/sensors/:sensor_id/', function(req, res, next){
  Sensor.findById(req.params.sensor_id).remove().exec( function(err,sensor){
    if (err) {
      console.log("Failed to delete sensor err: "+err);
      res.send({success:false});
    } else {
      res.send({success:true});
    }
  });
})

// add sensor data to the database
// note that Content-Type MUST be set to application/json for data to be accepted
.post('/sensors/:sensor_id/data',function(req, res, next){
  console.log("value was: "+req.body.value + " from sensor: "+req.params.sensor_id);
  if (req.params.sensor_id != null ) {
    if (req.body.value != null) {
      var point;
      if (req.body.collection_time != null) {
        point = {value: req.body.value,collection_time:req.body.collection_time};
      } else {
        point = {value: req.body.value};
      }

      Sensor.update({_id:req.params.sensor_id}, {$push: {"data": point} } ,{upsert: false}, function(err,raw){
        if (err) {
          console.log("Failed to add data point: "+err);
          res.status(404).send({success:false,error:err});
        } else if (raw.n !== 1) {
          console.log("Failed to add data point");
          res.status(404).send({success:false});
        } else {
          console.log("Success: "+err);
          console.log("Raw: "+raw)
          res.send({success:true,"raw":raw})
        }
      });
    }
  }
})

.delete('/sensors/:sensor_id/data',function(req, res, next){
  Sensor.findById(req.params.sensor_id,"data", function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      // empty the array
      var i = sensor.data.length;
      while (i--) {
        var point = sensor.data[i];
        sensor.data.remove(point);
      }
      sensor.save();
      res.send({success:true});
    }
  });
})

// return all data provided by the sensor with the given id
.get('/sensors/:sensor_id/data',function(req, res, next){
  Sensor.findById(req.params.sensor_id,"data", function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      res.send(sensor.data);
    }
  });
})

// return all data provided by the sensor with the given id within the the time period selected
.get('/sensors/:sensor_id/data/:time_period',function(req, res, next){
  console.log("Getting days sensor data for id:"+req.params.sensor_id);
  console.log("Requested sensor data from the last: "+ req.params.time_period);
  Sensor.findById(req.params.sensor_id,"data", function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      var filtered_data = filterData(sensor.data,req.params.time_period);
      res.send(filtered_data);
    }
  });
})

// special test function for attempting to do filtering within mongodb
.get('/sensors/:sensor_id/data/after-test/:time',function(req, res, next){
  console.log("Requested all sensor data from "+ req.params.sensor_id + " collected after "+ req.params.time);
  Sensor.findById(req.params.sensor_id,"data", function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      var filtered_data = sensor.data.filter(function(item) {
        if (itemAfter(item,req.params.time)) {
          return item;
        }
      });
      res.send(filtered_data);
    }
  });
})

// return all data with a collection_time later than that Requested
.get('/sensors/:sensor_id/data/after/:time',function(req, res, next){
  console.log("Requested all sensor data from "+ req.params.sensor_id + " collected after "+ req.params.time);
  Sensor.findById(req.params.sensor_id,"data", function(err,sensor){
    if (err) {
      console.log("Sensor not registered err: "+err);
      res.send({success:false});
    } else {
      var filtered_data = dataAfter(sensor.data,req.params.time);
      res.send(filtered_data);
    }
  });
})

// if none of these, 404
.get('*', function(req, res){
  res.status(404).send("No endpoint found");
})

;

module.exports = router;
