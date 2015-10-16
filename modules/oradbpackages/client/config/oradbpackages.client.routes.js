'use strict';

// Setting up route
angular.module('oradbpackages').config(['$stateProvider',
  function ($stateProvider) {
    // oradbpackages state routing
    $stateProvider
      .state('oradbpackages', {
        abstract: true,
        url: '/oradbpackages',
        template: '<ui-view/>'
      })
      .state('oradbpackages.list', {
        url: '',
        templateUrl: 'modules/oradbpackages/client/views/list-oradbpackages.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('oradbpackagesSearch', {
        url: '/search/:searchPhrase',
        templateUrl: 'modules/oradbpackages/client/views/search-oradbpackages.client.view.html'
      })
      .state('oradbpackages.view', {
        url: '/:name',
        templateUrl: 'modules/oradbpackages/client/views/view-oradbpackage.client.view.html'
      });
  }
]);
