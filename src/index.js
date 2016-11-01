const angular = require('angular');


angular
  .module('app', [require('angular-route')])
  .config(config)
  .controller('FormController', require('./form'));


function config($routeProvider) {
  $routeProvider
  .when('/upload', {
    templateUrl: 'upload.html'
  })
  .when('/', {
    templateUrl: 'dashboard.html'
  })
}
