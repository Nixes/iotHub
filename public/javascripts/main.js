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


iotHub.controller('ActorsController', function ActorController($scope, $http) {
  /*
  Each actor will have a structure like follows:
    - _id
    - name
    - state (varies from boolean to number to string)
  */
  $http.get('./api/actors',{ cache: true }).success(function(actors) {
    console.log("Actors: ");
    console.log(actors);
    $scope.actors = actors;
  });
  $scope.UpdateActorState = function(actor_id,new_state,old_state) {
    var data = {"state":new_state};
    $http.post('./api/actors/' + actor_id + '/state', data).then(function(received) {
      console.log("Received SUCCESS on updating actor state: ");
      console.log(received);
    },function (received) {
      console.log("Request FAILED received: ");
      console.log(received);
      new_state = old_state;
    });
  };
  $scope.DeleteActor = function (actor_index) {
    // delete from the server
    var confirmed = confirm("Are you sure you want to delete the actor?");
    if (confirmed) {
      $http.delete('./api/actors/' + $scope.actors[actor_index]._id ).success(function(received) {
        console.log("Received on deleting actor: ");
        console.log(received);
        // delete locally if successful
        $scope.actors.splice(actor_index,1);
      });
    } else {
      console.log("Declined actor deletion");
    }


  }
  $scope.$watch('actors', function(new_actors, old_actors) {
    console.log("An actor change was detected");
    console.log(old_actors);
    console.log(new_actors);
    for (let i = 0; i < new_actors.length; i++) {
      // see if the state has changed
      if (new_actors[i].state !== old_actors[i].state) {
        console.log("Change detected in actor id: " + new_actors[i]._id);
        $scope.UpdateActorState(new_actors[i]._id, new_actors[i].state, old_actors[i].state);
      }
    }
  },true);
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


iotHub.controller('BehavioursController', function ActorController($scope, $http) {
  $scope.selected_behaviour_contents = {}; // contents of currently selected behaviour
  $scope.new_behaviour_contents = {};

  $http.get('./api/behaviours',{ cache: true }).success(function(behaviours) {
    console.log("Behvaiours obtained: ");
    console.log(behaviours);
    $scope.behaviours = behaviours;
  });

  // used to reset behaviour contents before a new one is created
  $scope.ResetBehaviour = function () {
    console.log("Behaviour reset called");
    $scope.selected_behaviour_contents = null;
    $scope.new_behaviour_contents = null;
  }

  $scope.SelectBehaviour = function (behaviour_index) {
    console.log("SelectBehaviour has run, behaviour_index: "+behaviour_index);
    console.log("Contents at index:  ");
    console.log($scope.behaviours[behaviour_index]);
    // equalise the contents of both to allow a comparison
    $scope.selected_behaviour_contents = $scope.behaviours[behaviour_index];
    $scope.new_behaviour_contents = $scope.behaviours[behaviour_index];
  };
});

iotHub.controller('BehavioursModifyController', function OverviewController($scope, $http) {


  $http.get('./api/sensors',{ cache: true }).success(function(sensors) {
    $scope.sensors = sensors;
    console.log("Got sensors");
    console.log(sensors);
  });
  $http.get('./api/actors',{ cache: true }).success(function(actors) {
    $scope.actors = actors;
    console.log("Got actors");
    console.log(actors);
  });

  $scope.GetCompatibleValueType = function () {
    for (let sensor of $scope.sensors) {
      if ($scope.new_behaviour_contents.sensor === sensor._id) {
        $scope.new_behaviour_contents.data_type = sensor.data_type;
        console.log("Sensor data type was: ");
        console.log(sensor.data_type);
      }
    }
  };
  $scope.GetCompatibleActionType = function () {
    for (let actor of $scope.actors) {
      if ($scope.new_behaviour_contents.actor === actor._id) {
        $scope.new_behaviour_contents.state_type = actor.state_type;
      }
    }
  };

  $scope.$watch('new_behaviour_contents.actor', function() {
    $scope.GetCompatibleActionType();
  });
  $scope.$watch('new_behaviour_contents.sensor', function() {
    $scope.GetCompatibleValueType();
  });
  // check the differences between current and new behaviour properties
  $scope.GenerateDiff = function() {
    console.log("Generating Diff, new behaviour contents");
    console.log($scope.new_behaviour_contents);
    console.log("Old behaviour contents");
    console.log($scope.selected_behaviour_contents);
    var diff_object = {};

    // compare enabled
    if ($scope.selected_behaviour_contents.enabled !== $scope.new_behaviour_contents.enabled) {
      diff_object.actor = $scope.new_behaviour_contents.actor;
    }

    // compare sensor
    if ($scope.selected_behaviour_contents.sensor !== $scope.new_behaviour_contents.sensor) {
      diff_object.sensor = $scope.new_behaviour_contents.sensor;
    }

    // compare condition
    if ($scope.selected_behaviour_contents.condition !== $scope.new_behaviour_contents.condition) {
      diff_object.condition = $scope.new_behaviour_contents.condition;
    }

    // compare value
    if ($scope.selected_behaviour_contents.value !== $scope.new_behaviour_contents.value) {
      diff_object.value = $scope.new_behaviour_contents.value;
    }

    // compare actor
    if ($scope.selected_behaviour_contents.actor !== $scope.new_behaviour_contents.actor) {
      diff_object.enabled = $scope.new_behaviour_contents.enabled;
    }
    // compare action
    if ($scope.selected_behaviour_contents.action !== $scope.new_behaviour_contents.action) {
      diff_object.action = $scope.new_behaviour_contents.action;
    }

    // compare description
    if ($scope.selected_behaviour_contents.description !== $scope.new_behaviour_contents.description) {
      diff_object.description = $scope.new_behaviour_contents.description;
    }
    return diff_object;
  };

  $scope.SendUpdate = function() {
      var diff = $scope.GenerateDiff();
      if (Object.keys(diff).length !== 0) {
        console.log("Behaviour update sent to server: ");
        console.log(diff);
        if (!$scope.selected_behaviour_contents) { // if there is no selected sensor
          console.log("Sent a new behaviour");
          $http.post('./api/behaviours', diff).success(function(data) {
            console.log("Received on post: ");
            console.log(data);
          });
        } else {
          console.log("Modified an existing behaviour");
          $http.post('./api/behaviours/'+ $scope.selected_behaviour_contents._id, diff).success(function(data) {
            console.log("Received on post: ");
            console.log(data);
            // after change is made we should reset the currently selected behaviour
            $scope.selected_behaviour_contents = null;
          });
        }
      } else {
        console.log("Null diff generated, not sending");
      }
  };

  $scope.DeleteBehaviour = function() {
    var confirmed = confirm("Are you sure you want to delete the behaviour?");
    if (confirmed) {
      $http.delete('./api/behaviours/' + $scope.selected_behaviour_contents._id).success(function(received) {
        console.log("Received on deleting behaviour: ");
        console.log(received);
        DeleteSensorFromId($scope.behaviours,$scope.selected_behaviour_contents._id);
      });
    } else {
      console.log("Declined behaviour deletion");
    }
  };
});
