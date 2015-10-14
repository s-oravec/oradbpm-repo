'use strict';

// Configuring the oradbpackages module
angular.module('oradbpackages').run(['Menus',
  function (Menus) {
    // add search menu
    Menus.addMenuItem('topbar', {
      title: 'Search packages',
      state: 'oradbpackagesSearch',
      roles: ['*']
    });

    // Add the oradbpackages dropdown item
    Menus.addMenuItem('topbar', {
      title: 'My Packages',
      state: 'oradbpackages.list',
      roles: ['user']
    });

  }
]);
