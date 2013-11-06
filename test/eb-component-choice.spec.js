'use strict';

describe('Directive: edubase component choice', function () {
  var scope, $compile;

  beforeEach(module('edubaseComponents'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  it("should render the proper amount of choice options", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] }
    ];
    scope.activity = { id: 'a1' };

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" />');

    $compile(element)(scope);

    scope.$digest();

    var choicesElems = element.find('li');
    expect(choicesElems.length).toBe(2);

    var firstElem = angular.element(choicesElems[0]);
    expect(firstElem.find('label').text()).toBe('The first choice');
    expect(firstElem.find('input').attr('type')).toBe('radio');
    expect(firstElem.find('input').attr('name')).toBe('answer-a1');
    expect(firstElem.find('input').attr('id')).toBe('choice-a1-c1');
    expect(firstElem.find('input').attr('disabled')).toBeFalsy();
  });

  it("should render disabled choices", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] }
    ];
    scope.activity = { id: 'a1' };
    scope.optionsDisabled = true;

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" options-disabled="optionsDisabled" />');

    $compile(element)(scope);

    scope.$digest();

    var choicesElems = element.find('li');
    var firstElem = angular.element(choicesElems[0]);
    var secondElem = angular.element(choicesElems[1]);

    expect(firstElem.find('input').attr('disabled')).toBeTruthy();
    expect(secondElem.find('input').attr('disabled')).toBeTruthy();
  });

  it("should render empty when no choices or activity", function() {
    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" options-disabled="optionsDisabled" />');
    $compile(element)(scope);
    scope.$digest();

    expect(element).toBeDefined();
    expect(element.children().length).toBe(0);
  });

  it("should render empty when no activity", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] }
    ];

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" options-disabled="optionsDisabled" />');
    $compile(element)(scope);
    scope.$digest();

    expect(element).toBeDefined();
    expect(element.children().length).toBe(0);
  });

  it("should be able to select a choice", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] },
      { id: 'c3', value: [{ text: 'The third choice' }] }
    ];
    scope.activity = { id: 'a1' };

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" />');

    $compile(element)(scope);

    scope.$digest();

    var choicesElems = element.find('li');
    expect(choicesElems.length).toBe(3);

    scope.$apply(function() {
      scope.activity.value = 'c1';
    });

    expect(element.find('input:checked').attr('id')).toEqual('choice-a1-c1');

    scope.$apply(function() {
      scope.activity.value = 'c3';
    });

    expect(element.find('input:checked').attr('id')).toEqual('choice-a1-c3');
  });

  it("should be able to select a choice by triggering a click", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] },
      { id: 'c3', value: [{ text: 'The third choice' }] }
    ];
    scope.activity = { id: 'a1' };

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" />');

    $compile(element)(scope);

    scope.$digest();

    var choicesElems = element.find('li');
    expect(choicesElems.length).toBe(3);

    element.find('input')[0].click();

    expect(element.find('input:checked').attr('id')).toEqual('choice-a1-c1');

    element.find('input')[2].click();

    expect(element.find('input:checked').attr('id')).toEqual('choice-a1-c3');
  });

  it("should not select any value if choices do not match", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] }
    ];
    scope.activity = { id: 'a1', value: 'unknown' };

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" />');

    $compile(element)(scope);
    scope.$digest();

    expect(element.find('input:checked').length).toBe(0);
  });

  it("should trigger an event on change", function() {
    scope.choices = [
      { id: 'c1', value: [{ text: 'The first choice' }] },
      { id: 'c2', value: [{ text: 'The second choice' }] }
    ];
    scope.activity = { id: 'a1', value: 'c1' };

    var element = angular.element('<edubase-component-choice choices="choices" activity="activity" event="choiceChanged" />');

    scope.$on('choiceChanged', function (evt, answer) {
      scope.eventReturnObject = answer;
    });

    $compile(element)(scope);
    scope.$digest();

    element.find('input')[1].click();

    expect(scope.eventReturnObject).toBeDefined();
    expect(scope.eventReturnObject.activityId).toBe('a1');
    expect(scope.eventReturnObject.choiceId).toBe('c2');
  });

});