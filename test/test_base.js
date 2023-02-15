var assert = require('chai').assert
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

  describe('Math', function() {
    describe('#multiply()', function() {
      it('should multiply two numbers correctly', function() {
        assert.equal(2*3, 10);
      });
    });
  });