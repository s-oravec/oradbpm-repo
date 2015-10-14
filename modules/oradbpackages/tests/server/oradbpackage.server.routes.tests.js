'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  oradbpackage = mongoose.model('oradbpackage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, oradbpackage;

/**
 * oradbpackage routes tests
 */
describe('oradbpackage CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new oradbpackage
    user.save(function () {
      oradbpackage = {
        title: 'oradbpackage Title',
        content: 'oradbpackage Content'
      };

      done();
    });
  });

  it('should be able to save an oradbpackage if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new oradbpackage
        agent.post('/api/oradbpackages')
          .send(oradbpackage)
          .expect(200)
          .end(function (oradbpackageSaveErr, oradbpackageSaveRes) {
            // Handle oradbpackage save error
            if (oradbpackageSaveErr) {
              return done(oradbpackageSaveErr);
            }

            // Get a list of oradbpackages
            agent.get('/api/oradbpackages')
              .end(function (oradbpackagesGetErr, oradbpackagesGetRes) {
                // Handle oradbpackage save error
                if (oradbpackagesGetErr) {
                  return done(oradbpackagesGetErr);
                }

                // Get oradbpackages list
                var oradbpackages = oradbpackagesGetRes.body;

                // Set assertions
                (oradbpackages[0].user._id).should.equal(userId);
                (oradbpackages[0].title).should.match('oradbpackage Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an oradbpackage if not logged in', function (done) {
    agent.post('/api/oradbpackages')
      .send(oradbpackage)
      .expect(403)
      .end(function (oradbpackageSaveErr, oradbpackageSaveRes) {
        // Call the assertion callback
        done(oradbpackageSaveErr);
      });
  });

  it('should not be able to save an oradbpackage if no title is provided', function (done) {
    // Invalidate title field
    oradbpackage.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new oradbpackage
        agent.post('/api/oradbpackages')
          .send(oradbpackage)
          .expect(400)
          .end(function (oradbpackageSaveErr, oradbpackageSaveRes) {
            // Set message assertion
            (oradbpackageSaveRes.body.message).should.match('Title cannot be blank');

            // Handle oradbpackage save error
            done(oradbpackageSaveErr);
          });
      });
  });

  it('should be able to update an oradbpackage if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new oradbpackage
        agent.post('/api/oradbpackages')
          .send(oradbpackage)
          .expect(200)
          .end(function (oradbpackageSaveErr, oradbpackageSaveRes) {
            // Handle oradbpackage save error
            if (oradbpackageSaveErr) {
              return done(oradbpackageSaveErr);
            }

            // Update oradbpackage title
            oradbpackage.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing oradbpackage
            agent.put('/api/oradbpackages/' + oradbpackageSaveRes.body._id)
              .send(oradbpackage)
              .expect(200)
              .end(function (oradbpackageUpdateErr, oradbpackageUpdateRes) {
                // Handle oradbpackage update error
                if (oradbpackageUpdateErr) {
                  return done(oradbpackageUpdateErr);
                }

                // Set assertions
                (oradbpackageUpdateRes.body._id).should.equal(oradbpackageSaveRes.body._id);
                (oradbpackageUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of oradbpackages if not signed in', function (done) {
    // Create new oradbpackage model instance
    var oradbpackageObj = new oradbpackage(oradbpackage);

    // Save the oradbpackage
    oradbpackageObj.save(function () {
      // Request oradbpackages
      request(app).get('/api/oradbpackages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single oradbpackage if not signed in', function (done) {
    // Create new oradbpackage model instance
    var oradbpackageObj = new oradbpackage(oradbpackage);

    // Save the oradbpackage
    oradbpackageObj.save(function () {
      request(app).get('/api/oradbpackages/' + oradbpackageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', oradbpackage.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single oradbpackage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/oradbpackages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'oradbpackage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single oradbpackage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent oradbpackage
    request(app).get('/api/oradbpackages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No oradbpackage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an oradbpackage if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new oradbpackage
        agent.post('/api/oradbpackages')
          .send(oradbpackage)
          .expect(200)
          .end(function (oradbpackageSaveErr, oradbpackageSaveRes) {
            // Handle oradbpackage save error
            if (oradbpackageSaveErr) {
              return done(oradbpackageSaveErr);
            }

            // Delete an existing oradbpackage
            agent.delete('/api/oradbpackages/' + oradbpackageSaveRes.body._id)
              .send(oradbpackage)
              .expect(200)
              .end(function (oradbpackageDeleteErr, oradbpackageDeleteRes) {
                // Handle oradbpackage error error
                if (oradbpackageDeleteErr) {
                  return done(oradbpackageDeleteErr);
                }

                // Set assertions
                (oradbpackageDeleteRes.body._id).should.equal(oradbpackageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an oradbpackage if not signed in', function (done) {
    // Set oradbpackage user
    oradbpackage.user = user;

    // Create new oradbpackage model instance
    var oradbpackageObj = new oradbpackage(oradbpackage);

    // Save the oradbpackage
    oradbpackageObj.save(function () {
      // Try deleting oradbpackage
      request(app).delete('/api/oradbpackages/' + oradbpackageObj._id)
        .expect(403)
        .end(function (oradbpackageDeleteErr, oradbpackageDeleteRes) {
          // Set message assertion
          (oradbpackageDeleteRes.body.message).should.match('User is not authorized');

          // Handle oradbpackage error error
          done(oradbpackageDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      oradbpackage.remove().exec(done);
    });
  });
});
