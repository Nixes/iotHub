// enable graphing module
angular.module('myModule', ['chart.js']);

// Define the `phonecatApp` module
var iotHub = angular.module('iotHub', []);

iotHub.controller('OverviewController', function OverviewController($scope, $http) {
  $http.get('./api/sensors').success(function(data) {
    $scope.sensors = data;
  });

});


iotHub.controller('SensorsController', function OverviewController($scope, $http) {
  $http.get('./api/sensors').success(function(sensors) {
    $scope.sensors = sensors;
  });
});
