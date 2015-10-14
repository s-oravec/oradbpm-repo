'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', 'OraDBPackages',
  function ($scope, Authentication, $state, OraDBPackages) {

    $scope.searchForm = {
      searchPhrase: undefined
    };

    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.search = function (searchPhrase) {
      $state.go('oradbpackagesSearch', {searchPhrase: searchPhrase});
    };

    //TODO: rewrite to get sample
    $scope.findSome = function () {
      $scope.oradbpackages = OraDBPackages.query();
    };
  }
]);
