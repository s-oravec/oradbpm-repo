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
        {searchPhrase: $stateParams.searchPhrase}
      );
    };

    // Find existing oradbpackage
    $scope.findOne = function () {
      $scope.oradbpackage = OraDBPackages.get({
        oradbpackageId: $stateParams.oradbpackageId
      });
    };

    $scope.search = function () {
      console.log($scope.searchForm.searchPhrase);
      $state.go('oradbpackagesSearch', {
        searchPhrase: $scope.searchForm.searchPhrase
      });
    };

  }
]);
