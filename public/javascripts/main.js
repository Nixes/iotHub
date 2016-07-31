// enable graphing module
angular.module('myModule', ['chart.js']);

// define the iotHub module so we can use it
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
