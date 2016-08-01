// enable graphing module
angular.module('myModule', ['chart.js']);

// define the iotHub module so we can use it
var iotHub = angular.module('iotHub', []);

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


iotHub.controller("LineChart", function ($scope) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
});
