// define the iotHub module so we can use it
var iotHub = angular.module('iotHub', ['chart.js']);

// utility functions for formating data for graphing
function reformatData(data) {
  var finalData = [];
  for (var point of data) {
    if (point.value !== undefined && point.collection_time !== undefined) {
      finalData.push({x:new Date(point.collection_time),y:point.value});
    }
  }
  console.log(finalData);
  return finalData;
}


iotHub.controller('OverviewController', function OverviewController($scope, $http) {
  $http.get('./api/sensors',{ cache: true }).success(function(data) {
    $scope.sensors = data;
  });

});


iotHub.controller('SensorsController', function OverviewController($scope, $http) {
  $http.get('./api/sensors',{ cache: true }).success(function(sensors) {
    $scope.sensors = sensors;
  });
  $scope.model = null;
});

iotHub.controller('LineCtrl', function ($scope, $http) {
  $http.get('./api/sensors/579ae0246dc2e0a8192ea110/data').success(function(data) {
    $scope.data = reformatData(data);
  });
  $scope.data =  [{
                x: -10,
                y: 0
            }, {
                x: 0,
                y: 10
            }, {
                x: 10,
                y: 5
            }];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.onHover = function (points) {
    if (points.length > 0) {
      console.log('Point', points[0].value);
    } else {
      console.log('No point');
    }
  };

  $scope.options = {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
  };
});
