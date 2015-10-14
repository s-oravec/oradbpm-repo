'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke oradbpackages Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/1/packages',
      permissions: '*'
    }, {
      resources: '/api/1/packages/:oradbpackageId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/1/packages',
      permissions: ['get', 'post']
    }, {
      resources: '/api/1/packages/:oradbpackageId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/1/packages',
      permissions: ['get']
    }, {
      resources: '/api/1/packages/:oradbpackageId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If oradbpackages Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an oradbpackage is being processed and the current user created it then allow any manipulation
  if (req.oradbpackage && req.user && req.oradbpackage.userId === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
