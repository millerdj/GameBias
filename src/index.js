const angular = require('angular');

angular
  .module('app', [require('angular-route')])
  .config(config)
  .controller('FormController', require('./form'))
  .controller('DashboardController', require('./dashboard'))
  .controller('VideoController', require('./video'));

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
  .when('/video/:filename', {
    templateUrl: 'video.html',
    controller: 'VideoController'
  })
}
