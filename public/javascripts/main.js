// Define the `phonecatApp` module
var iotHub = angular.module('iotHub', []);

iotHub.controller('OverviewController', function OverviewController($scope) {
  $scope.sensors = [
  {
    name:"Inside Temp",
    value: "23"
  },
  {
    name:"Outside Temp",
    value: "11"
  }];
}


);
