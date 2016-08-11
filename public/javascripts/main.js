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
    $scope.sensors = data;
  });
});

iotHub.controller('SensorsController', function OverviewController($scope, $http) {
  $http.get('./api/sensors',{ cache: true }).success(function(sensors) {
    $scope.sensors = sensors;
  });
  $scope.selected_sensor = null;
  $scope.time_period = null;
  $scope.data = null;
  $scope.table_count = 5;

  $scope.change = function () {
    console.log($scope.selected_sensor);
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


iotHub.controller('SensorsConfigController', function OverviewController($scope, $http) {
  $scope.init = function () {
    $http.get('./api/sensors/' + $scope.selected_sensor,{ cache: true }).success(function(sensor) {
      console.log("Config selected_sensor:"+$scope.selected_sensor)
      $scope.sensor = sensor;
    });
  }
  // use $scope.selected_sensor to obtain id of sensor to edit

});
