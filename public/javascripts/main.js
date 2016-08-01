// define the iotHub module so we can use it
var iotHub = angular.module('iotHub', ['chart.js']);

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

iotHub.controller('LineCtrl', ['$scope', function ($scope) {
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
}]);
