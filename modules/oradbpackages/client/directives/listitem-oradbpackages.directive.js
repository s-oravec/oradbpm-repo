'use strict';

angular.module('oradbpackages').directive('oraDbPackageListItem', function () {

  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      oradbpackage: '=ngModel'
    },
    templateUrl: '/modules/oradbpackages/client/directives/listitem-oradbpackages.template.html'
  };

});
