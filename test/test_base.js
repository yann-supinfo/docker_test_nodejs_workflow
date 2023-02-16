const func = require('../services/func_test')


var assert = require('chai').assert
  , foo = 'bar'
  , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
      });
    });
  });

  describe('test 2', () => {

    it('addition de deux nombres est égale à 5', () => {
         const a = 3;
         const b = 3;
         assert.equal(a + b, 6)
    })

  })

  describe('test de la fonction mult', () => {

    it('multiplication fonctionne', () => {
         const a = 2;
         const b = 3;
         assert.equal(func.mult(a, b), 6)
    })

  })