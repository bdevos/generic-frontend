'use strict';

frontendComponentsApp.controller('ChoiceCtrl', function ($scope) {
  var activeChoice = {
    name: 'Active choice',
    choices: [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] },
      { id: 'c3', value: [{ text: 'The third choice' }] },
      { id: 'c4', value: [{ text: 'The fourth choice' }]}
    ],
    activity: { id: 'a1' },
    optionsDisabled: false
  };

  var inactiveChoice = {
    name: 'Inactive choice',
    choices: [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] },
      { id: 'c3', value: [{ text: 'The third choice' }] },
      { id: 'c4', value: [{ text: 'The fourth choice' }]}
    ],
    activity: { id: 'a2', value: 'c3' },
    optionsDisabled: true
  };

  var choices = [];
  choices.push(activeChoice);
  choices.push(inactiveChoice);

  $scope.choices = choices;
});