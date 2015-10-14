'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  oradbpackage = mongoose.model('oradbpackage');

/**
 * Globals
 */
var user, oradbpackage;

/**
 * Unit tests
 */
describe('oradbpackage Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      oradbpackage = new oradbpackage({
        title: 'oradbpackage Title',
        content: 'oradbpackage Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return oradbpackage.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      oradbpackage.title = '';

      return oradbpackage.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    oradbpackage.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
