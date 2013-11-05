'use strict';

var frontendComponentsApp = angular.module('frontendComponentsApp', [ 'ngRoute' ]);

frontendComponentsApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/overview.html',
      controller: 'OverviewCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
