var app = angular.module('tableApp', []);

app.controller('mainCtrl', function($scope) {

  'use strict';

  var scope = $scope;
  var prevSortType = 'firstName';

  scope.orderType = prevSortType;
  scope.orderReverse = false;
  scope.showForm = false;
  scope.patterns = {
    words: /^[a-zA-Zа-яА-ЯёЁ]+(-[a-zA-Zа-яА-ЯёЁ]+)?$/,
    phone: /^[0-9]{7,10}$/,
    age: /^[1-9][0-9]?$/
  };
  scope.tableHeaders = [
    { name: 'First Name', type: 'firstName'},
    { name: 'Last Name', type: 'lastName'},
    { name: 'Phone', type: 'phone'},
    { name: 'Gender', type: 'gender'},
    { name: 'Age', type: 'age'}
  ];
  /* Initial contacts data */
  scope.contacts = [
    {
      firstName : 'Bob',
      lastName : 'Dylan',
      phone: '0735205315',
      gender : 'male',
      age : 69
    },
    {
      firstName : 'Stan',
      lastName : 'Dup',
      phone: '0666666666',
      gender : 'male',
      age : 42
    },
    {
      firstName : 'Rosa',
      lastName : 'Svedovsky',
      phone: '0462627822',
      gender : 'female',
      age : 25
    }
  ];
  scope.inputs = {};
  scope.selectedContact = {};

  scope.showOptions = function(contact) {
    scope.selectedContact = (contact = contact || {});
    if (Object.keys(contact).length && contact.checked) {
      contact.age = parseInt(contact.age);
      scope.inputs = angular.copy(contact);
      scope.showForm = true;
    } else if (!scope.showForm) {
      scope.formReset();
      scope.showForm = true;
    } else {
      scope.clearForm();
    }
  };

  scope.formReset = function() {
    scope.inputs = {};
  };

  scope.clearForm = function() {
    scope.showForm = false;
    scope.formReset();
    scope.selectedContact = {};

    scope.contacts.forEach(function(el) {
      el.checked = false;
      el.edit = false;
    });
  };

  scope.checkboxFilter = function(contact) {
    for (var i in scope.contacts) {
      if (scope.contacts[i] != contact) {
        scope.contacts[i].checked = false;
      }
    }
  };

  scope.formSubmit = function () {
    var index = scope.contacts.indexOf(scope.selectedContact);

    if (index === -1) {
      var newContact = angular.copy(scope.inputs);
      newContact.age = Number(newContact.age);
      scope.contacts.push(newContact);
    } else {
      scope.contacts[index] = angular.copy(scope.inputs);
      scope.selectedContact = scope.contacts[index];
    }
    scope.clearForm();
  };

  scope.removeContact = function(contact) {
    var index = scope.contacts.indexOf(contact);

    scope.contacts.splice(index, 1);
  };

  scope.sort = function (orderType) {
    console.log(orderType, prevSortType);
    if (orderType === prevSortType) {
      scope.orderReverse = !scope.orderReverse;
    } else {
      scope.orderReverse = false;
      scope.orderType = orderType;
      prevSortType = orderType;
    }
  };
});
