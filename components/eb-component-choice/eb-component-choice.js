(function(window, angular, undefined) {
  'use strict';

  var edubaseComponents = angular.module('edubaseComponents', []);

  edubaseComponents.directive('edubaseComponentChoice', function () {
    return {
      restrict: 'E',
      template: '<ul class="eb-question eb-question-choice">' +
        '<li ng-if="activity" ng-repeat="choice in choices">' +
        '<input type="radio" id="choice-{{ activity.id }}-{{ choice.id }}" name="answer-{{ activity.id }}" ' +
        'ng-disabled="optionsDisabled" ' +
        'value="{{ choice.id }}" ng-model="activity.value" ng-change="triggerEvent(choice.id)" />' +
        '<label for="choice-{{ activity.id }}-{{ choice.id }}">{{ choice.value[0].text }}</label>' +
        '</li></ul>',
      replace: true,
      scope: {
        choices: '=',
        activity: '=',
        optionsDisabled: '=',
        event: '@'
      },
      link: function postLink(scope) {
        scope.triggerEvent = function(choiceId) {
          if (scope.event !== undefined) {
            scope.$emit(scope.event, {
              activityId: scope.activity.id,
              choiceId: choiceId
            });
          }
        };
      }
    };
  });
})(window, window.angular);