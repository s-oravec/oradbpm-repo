'use strict';

//oradbpackages service used for communicating with the oradbpackages REST endpoints
angular.module('oradbpackages').factory('OraDBPackages', ['$resource',
  function ($resource) {
    return $resource('api/1/packages/:name', {
      name: '@name'
    });
  }
]);
