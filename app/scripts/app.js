'use strict';

var frontendComponentsApp = angular.module('frontendComponentsApp', ['ngRoute', 'ebQuestions' ]);

frontendComponentsApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/studentOverview.html',
      controller: 'StudentOverviewCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
