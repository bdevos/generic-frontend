'use strict';

var frontendComponentsApp = angular.module('frontendComponentsApp', [ 'ngRoute', 'edubaseComponents' ]);

frontendComponentsApp.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/overview.html',
      controller: 'OverviewCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});
