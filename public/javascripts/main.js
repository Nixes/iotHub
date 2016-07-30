// Define the `phonecatApp` module
var iotHub = angular.module('iotHub', []);

iotHub.controller('OverviewController', function OverviewController($scope, $http) {
  $http.get('./api/sensors').success(function(data) {
    $scope.sensors = data;

  });

  }
);
