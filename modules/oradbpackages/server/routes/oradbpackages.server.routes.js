'use strict';

/**
 * Module dependencies.
 */
var oradbpackagesPolicy = require('../policies/oradbpackages.server.policy'),
  oradbpackages = require('../controllers/oradbpackages.server.controller');

module.exports = function (app) {
  // oradbpackages collection routes
  app.route('/api/1/packages').all(oradbpackagesPolicy.isAllowed)
    .get(oradbpackages.list)
    .post(oradbpackages.create);

  // Single oradbpackage routes
  app.route('/api/1/packages/:oradbpackageId').all(oradbpackagesPolicy.isAllowed)
    .get(oradbpackages.read)
    .put(oradbpackages.update)
    .delete(oradbpackages.delete);

  // Finish by binding the oradbpackage middleware
  app.param('oradbpackageId', oradbpackages.pkgByID);
};
