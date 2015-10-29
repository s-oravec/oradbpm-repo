'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  semver = require('semver'),
  Bluebird = require("bluebird"),
  mongooseAsync = Bluebird.promisifyAll(require("mongoose")),
  _ = require('lodash'),
  OraDBPackage = mongooseAsync.model('OraDBPackage'),
  OraDBPackageVersion = mongooseAsync.model('OraDBPackageVersion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  debug = require('debug')('oradbpm:oradbpackages:ctrl');

// TODO: refactor - move to utils
var encodeKey = function (key) {
  return key.replace(/\./g, '\uff0e').replace(/\$/g, '\uff04').replace(/\\/g, '\\\\');
};

// TODO: refactor - move to utils
var decodeKey = function (key) {
  return key.replace(/\uff0e/g, '.').replace(/\uff04/g, '$').replace(/\\\\/g, '\\');
};

// TODO: refactor - move to utils
var ServerException = function (message) {
  this.message = message;
  this.name = 'ServerException';
};

var createPackageVersion = function (req) {

  var pkgVersion = new OraDBPackageVersion();

  // TODO: maintainers
  pkgVersion.maintainers = [req.user.getUsernameEmail()];
  pkgVersion.name = req.body.name;
  pkgVersion.version = req.body.version;
  pkgVersion.license = req.body.license;
  pkgVersion.keywords = req.body.keywords;
  pkgVersion.notes = req.body.notes;
  pkgVersion.publisherId = req.user._id;
  pkgVersion.publisher = req.user.getUsernameEmail();
  pkgVersion.created = Date.now();

  return Bluebird.resolve(pkgVersion);

  // save package version only as subdocument of package
  //return pkgVersion.saveAsync()
  //  .then(function (result) {
  //    return result[0];
  //  });
};

var createPackage = function (req, pkgVersion) {

  var pkg = new OraDBPackage();
  var encodedVersion = encodeKey(req.body.version);

  pkg.name = req.body.name;
  pkg.description = req.body.description;
  pkg.tags = {
    latest: req.body.version
  };
  pkg.versions = [
    req.body.version
  ];
  pkg.versionSubdocuments = {};
  pkg.versionSubdocuments[encodedVersion] = pkgVersion;
  pkg.maintainers = [req.user.getUsernameEmail()];
  pkg.time = {
    modified: pkgVersion.created,
    created: pkgVersion.created
  };
  pkg.time[encodedVersion] = pkgVersion.created;
  pkg.author = req.user.getFullnameEmail();
  pkg.authorId = req.user._id;
  // TODO: validate repository type & url
  pkg.repository = {
    type: "git",
    url: req.body.repository.url
  };
  pkg.version = req.body.version;
  pkg.license = req.body.license;
  pkg.keywords = req.body.keywords;
  pkg.notes = req.body.notes;

  console.log(pkg);

  return pkg.saveAsync();
};

var updatePackage = function (req, pkg, pkgVersion) {

  var encodedVersion = encodeKey(req.body.version);

  if (pkg.versions.indexOf(req.body.version) === -1) {
    pkg.versions.push(req.body.version);
    pkg.versions.sort(semver.compare);
  } else {
    return Bluebird.reject({
      message: 'Package version already exists.'
    });
  }
  pkg.description = req.body.description;

  pkg.versionSubdocuments[encodedVersion] = pkgVersion;
  pkg.markModified('versionSubdocuments');
  pkg.time.modified = pkgVersion.created;
  pkg.time[encodedVersion] = pkgVersion.created;
  pkg.markModified('time');
  pkg.tags.latest = req.body.version;
  pkg.markModified('tags');
  pkg.repository = {
    type: "git",
    url: req.body.repository.url
  };
  pkg.markModified('repository');
  pkg.version = req.body.version;
  pkg.license = req.body.license;
  pkg.keywords = req.body.keywords;
  pkg.notes = req.body.notes;

  console.log(pkg);

  return pkg.saveAsync();
};

/**
 * Create a pkg
 */
exports.create = function (req, res) {

  var promise = Bluebird.resolve();

  //scenario
  //1. get package by name
  promise
    .then(function () {
      return OraDBPackage.findOneAsync({name: req.body.name});
    })
    .then(function (pkg) {
      //1.1. not exists -> it's new package with no name conflict - yay!
      if (pkg === null) {
        //1.1.1. create package version
        return createPackageVersion(req)
          //1.1.2. create package
          .then(function (pkgVersion) {
            return createPackage(req, pkgVersion);
          });
      }
      //1.2. exists
      else {
        //1.2.1. user not in package.maintainers -> error
        if (pkg.maintainers.indexOf(req.user.getUsernameEmail()) === -1) {
          throw new ServerException('User ' + req.user.getUsernameEmail() + ' not in maintainers list.');
        } else {
          //1.2.2. user is one of maintainers
          //1.2.2.1. create pacakge version
          return createPackageVersion(req)
            .then(function (pkgVersion) {
              //1.2.2.2.2. succeeds -> update package
              return updatePackage(req, pkg, pkgVersion);
            });
        }
      }
    })
    .then(function () {
      return res.json({message: 'Success'});
    })
    .catch(function (err) {
      console.log(err);
      console.log(err.message);
      return res.status(400).send({
        message: err.message || errorHandler.getErrorMessage(err)
      });
    });
}
;

/**
 * Show the current pkg
 */
exports.read = function (req, res) {
  res.json(req.pkg);
};

/**
 * Update a pkg
 */
exports.update = function (req, res) {
  var pkg = req.pkg;

  pkg.title = req.body.title;
  pkg.content = req.body.content;

  pkg.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pkg);
    }
  });
};

/**
 * Delete an pkg
 */
exports.delete = function (req, res) {
  var pkg = req.pkg;

  pkg.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pkg);
    }
  });
};

/**
 * List of pkgs
 */
exports.list = function (req, res) {

  if (!!req.query.q) {

    debug('fulltext search with query', req.query.q);

    OraDBPackage.find(
      {$text: {$search: req.query.q}},
      {score: {$meta: "textScore"}}
    )
      .sort({score: {$meta: 'textScore'}})
      .exec(function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          debug('results', results);
          res.json(results);
        }
      });

  } else {

    OraDBPackage.find().sort('-created').exec(function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(results);
      }
    });

  }
};

/**
 * pkg middleware
 */
exports.pkgByName = function (req, res, next, name) {
  OraDBPackage.findOne({name: name}).exec(function (err, pkg) {
    if (err) {
      return next(err);
    } else if (!pkg) {
      return res.status(404).send({
        message: 'No package with that name has been found'
      });
    }
    req.pkg = pkg;
    next();
  });
};
