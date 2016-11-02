const angular = require('angular');

angular
  .module('app', [require('angular-route')])
  .config(config)
  .controller('FormController', require('./form'))
  .controller('DashboardController', require('./dashboard'));

function config($routeProvider) {
  $routeProvider
  .when('/upload', {
    templateUrl: 'upload.html',
    controller: 'FormController'
  })
  .when('/', {
    templateUrl: 'dashboard.html',
    controller: 'DashboardController'
  })
}
