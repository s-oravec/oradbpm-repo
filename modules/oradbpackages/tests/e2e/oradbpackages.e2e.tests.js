'use strict';

describe('oradbpackages E2E Tests:', function () {
  describe('Test oradbpackages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/oradbpackages');
      expect(element.all(by.repeater('oradbpackage in oradbpackages')).count()).toEqual(0);
    });
  });
});
