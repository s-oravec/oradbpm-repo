'use strict';

// oradbpackages controller
angular.module('oradbpackages').controller('oradbpackagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'OraDBPackages', '$state',
  function ($scope, $stateParams, $location, Authentication, OraDBPackages, $state) {
    $scope.authentication = Authentication;

    $scope.searchForm = {
      searchPhrase: $stateParams.searchPhrase
    };

    // Find a list of oradbpackages
    $scope.find = function () {
      $scope.oradbpackages = OraDBPackages.query(
        {q: $stateParams.searchPhrase}
      );
    };

    // Find existing oradbpackage
    $scope.findOne = function () {
      console.log($stateParams);
      $scope.oradbpackage = OraDBPackages.get({
        name: $stateParams.name
      });
    };

    $scope.search = function (searchPhrase) {
      $state.go('oradbpackagesSearch', {
        searchPhrase: searchPhrase
      });
    };

  }
]);
