'use strict';

(function () {
  // oradbpackages Controller Spec
  describe('oradbpackages Controller Tests', function () {
    // Initialize global variables
    var oradbpackagesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      OraDBPackages,
      mockoradbpackage;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _oradbpackages_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      OraDBPackages = _oradbpackages_;

      // create mock oradbpackage
      mockoradbpackage = new OraDBPackages({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An oradbpackage about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the oradbpackages controller.
      oradbpackagesController = $controller('oradbpackagesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one oradbpackage object fetched from XHR', inject(function (oradbpackages) {
      // Create a sample oradbpackages array that includes the new oradbpackage
      var sampleoradbpackages = [mockoradbpackage];

      // Set GET response
      $httpBackend.expectGET('api/oradbpackages').respond(sampleoradbpackages);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.oradbpackages).toEqualData(sampleoradbpackages);
    }));

    it('$scope.findOne() should create an array with one oradbpackage object fetched from XHR using a oradbpackageId URL parameter', inject(function (oradbpackages) {
      // Set the URL parameter
      $stateParams.oradbpackageId = mockoradbpackage._id;

      // Set GET response
      $httpBackend.expectGET(/api\/oradbpackages\/([0-9a-fA-F]{24})$/).respond(mockoradbpackage);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.oradbpackage).toEqualData(mockoradbpackage);
    }));

    describe('$scope.create()', function () {
      var sampleoradbpackagePostData;

      beforeEach(function () {
        // Create a sample oradbpackage object
        sampleoradbpackagePostData = new OraDBPackages({
          title: 'An oradbpackage about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An oradbpackage about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (oradbpackages) {
        // Set POST response
        $httpBackend.expectPOST('api/oradbpackages', sampleoradbpackagePostData).respond(mockoradbpackage);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the oradbpackage was created
        expect($location.path.calls.mostRecent().args[0]).toBe('oradbpackages/' + mockoradbpackage._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/oradbpackages', sampleoradbpackagePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock oradbpackage in scope
        scope.oradbpackage = mockoradbpackage;
      });

      it('should update a valid oradbpackage', inject(function (oradbpackages) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/oradbpackages\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/oradbpackages/' + mockoradbpackage._id);
      }));

      it('should set scope.error to error response message', inject(function (oradbpackages) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/oradbpackages\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(oradbpackage)', function () {
      beforeEach(function () {
        // Create new oradbpackages array and include the oradbpackage
        scope.oradbpackages = [mockoradbpackage, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/oradbpackages\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockoradbpackage);
      });

      it('should send a DELETE request with a valid oradbpackageId and remove the oradbpackage from the scope', inject(function (oradbpackages) {
        expect(scope.oradbpackages.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.oradbpackage = mockoradbpackage;

        $httpBackend.expectDELETE(/api\/oradbpackages\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to oradbpackages', function () {
        expect($location.path).toHaveBeenCalledWith('oradbpackages');
      });
    });
  });
}());
