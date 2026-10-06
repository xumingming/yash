(function () {
  'use strict';

  describe('appModules', function () {
    describe('utils', function () {
      it('should be exposed by the test bundle', function () {
        expect(window.appModules).to.be.an('object');
        expect(window.appModules.utils).to.be.an('object');
      });
    });
  });
})();
