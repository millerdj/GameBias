const angular = require('angular');

angular
  .module('app', [require('angular-route'), require('angular-sanitize')])
  .config(config)
  .controller('FormController', require('./form'))
  .controller('DashboardController', require('./dashboard'))
  .controller('VideoController', require('./video'))
  .filter('trusted', ['$sce', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);

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
