// define the iotHub module so we can use it
var iotHub = angular.module('iotHub', ['chart.js']);

// utility functions for formating data for graphing
function reformatData(data) {
  var finalData = [];
  for (var i = 0;  i<data.length; i++ ) {
    var point = data[i];
    if (point.value !== undefined && point.collection_time !== undefined) {
      finalData.push({x:new Date(point.collection_time),y:point.value});
    }
  }
  console.log(finalData);
  // this is an odd undocumented requirement of angular-chartjs: http://stackoverflow.com/questions/38239877/unable-to-parse-color-in-line-chart-angular-chart-js
  return [finalData];
}

// delete a sensor from an array based on a sensor id
function DeleteSensorFromId (sensors,sensor_id) {
  for(var i=0;i < sensors.length; i++) {
    if (sensors[i]._id === sensor_id) {
      sensors.splice(i, 1); // remove 1 element from position i
    }
  }
}

// the below manages tab location
$(document).ready(function() {
    // show active tab on reload
    if (location.hash !== '') {
      $('a[href="' + location.hash + '"]').tab('show');
    } else {
      // if no location hash go to a default page
      $('a[href="' + "#overview-tab" + '"]').tab('show');
    }

    // remember the hash in the URL without jumping
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
       if(history.pushState) {
            history.pushState(null, null, '#'+$(e.target).attr('href').substr(1));
       } else {
            location.hash = '#'+$(e.target).attr('href').substr(1);
       }
    });
});


iotHub.controller('OverviewController', function OverviewController($scope, $http) {
  $http.get('./api/overview',{ cache: true }).success(function(data) {
    $scope.items = data;
    console.log(data);
  });
});

iotHub.controller('SensorsController', function OverviewController($scope, $http) {
  $http.get('./api/sensors',{ cache: true }).success(function(sensors) {
    $scope.sensors = sensors;
  });
  $scope.selected_sensor_contents = null;
  $scope.selected_sensor = null;
  $scope.time_period = null;
  $scope.data = null;
  $scope.table_count = 5;

  $scope.change = function () {
    console.log($scope.selected_sensor);
    if ($scope.selected_sensor !== null ) {
      $http.get('./api/sensors/'+ $scope.selected_sensor).success(function(sensor) {
        $scope.selected_sensor_contents = sensor;
        console.log(sensor);
      });
    }

    if ( ( $scope.selected_sensor !== null ) &&  ( $scope.time_period !== null ) ) {
      $http.get('./api/sensors/'+ $scope.selected_sensor +'/data/' + $scope.time_period ).success(function(data) {
        $scope.data = reformatData(data);
      });
    }
  };
  $scope.options = {
    elements: {
        line: {
          tension: 0
        }
    },
    scales: {
      xAxes: [{
        position: 'bottom',
        type: 'time'
      }]
    }
  };
});


iotHub.controller('ActorController', function ActorController($scope, $http) {
  /*
  Each actor will have a structure like follows:
    - _id
    - name
    - state (varies from boolean to number to string)
  */
  $http.get('./api/actors',{ cache: true }).success(function(actors) {
    $scope.actors = actors;
  });
});

iotHub.controller('SensorsConfigController', function OverviewController($scope, $http) {
  $scope.new_sensor_contents = {};

  // what the new overview state will be
  $scope.show_overview = false;

  // what the current overview state is
  $scope.on_overview;

  $scope.GetOverview = function () {
    $http.get('./api/overview/'+ $scope.selected_sensor).success(function(data) {
      if (data.sensor === $scope.selected_sensor) {
        console.log("Sensor Was on Overview and validated");
        $scope.on_overview = true;
        $scope.show_overview = true;
      } else {
        $scope.on_overview = false;
        $scope.show_overview = false;
      }
    });
  };
  $scope.UpdateOverview = function () {
    // compare overview state
    if ($scope.show_overview !== $scope.on_overview) {
      if ($scope.show_overview) {
        // only update if the state was changed
        var data = {};
        data.sensor =  $scope.selected_sensor;
        $http.post('./api/overview', data).success(function(received) {
          console.log("Received on Add Overview: ");
          console.log(received);
        });
      } else {
        // remove existing overview entry
        $http.delete('./api/overview/' + $scope.selected_sensor ).success(function(received) {
          console.log("Received on Delete Overview: ");
          console.log(received);
        });
      }
    }
  };

  // check the differences between current and new sensor properties
  $scope.GenerateDiff = function() {
    console.log("Generating Diff new contents");
    console.log($scope.new_sensor_contents);
    console.log("Old contents");
    console.log($scope.selected_sensor_contents);
    var diff_object = {};

    // compare name
    if ($scope.selected_sensor_contents.name !== $scope.new_sensor_contents.name) {
      diff_object.name = $scope.new_sensor_contents.name;
    }

    // compare description
    if ($scope.selected_sensor_contents.description !== $scope.new_sensor_contents.description) {
      diff_object.description = $scope.new_sensor_contents.description;
    }
    return diff_object;
  };

  $scope.SendUpdate = function() {
      $scope.UpdateOverview();

      var diff = $scope.GenerateDiff();
      if (Object.keys(diff).length !== 0) {
        console.log("Sensor update sent to server: ");
        console.log(diff);
        $http.post('./api/sensors/'+ $scope.selected_sensor, diff).success(function(data) {
          console.log("Received on post: ");
          console.log(data);
        });
      } else {
        console.log("Null diff generated, not sending");
      }
  };

  $scope.$watch('selected_sensor_contents', function() {
    // have to manually copy properties or javascript will try to set via a reference
    $scope.new_sensor_contents = {name:  $scope.selected_sensor_contents.name, description:$scope.selected_sensor_contents.description };
    $scope.GetOverview();
  });

  // delete all existing sensor data
  $scope.WipeData = function() {
    var confirmed = confirm("Are you sure you want to nuke ALL SENSOR DATA from the beginning of time?");
    if (confirmed) {
      $http.delete('./api/sensors/' + $scope.selected_sensor + '/data').success(function(received) {
        console.log("Received on wiping sensor data: ");
        console.log(received);
      });
    } else {
      console.log("Declined wiping sensor data");
    }
  };
  $scope.DeleteSensor = function() {
    var confirmed = confirm("Are you sure you want to delete the sensor and all its data?");
    if (confirmed) {
      $http.delete('./api/sensors/' + $scope.selected_sensor).success(function(received) {
        console.log("Received on deleting sensor: ");
        console.log(received);
        DeleteSensorFromId($scope.sensors,$scope.selected_sensor);
      });
    } else {
      console.log("Declined sensor deletion");
    }
  };
});


iotHub.controller('BehaviourController', function ActorController($scope, $http) {
  $http.get('./api/behaviours',{ cache: true }).success(function(behaviours) {
    $scope.behaviours = behaviours;
  });
});
