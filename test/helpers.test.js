const assert = require('assert');
const { computeAppleDelay } = require('../assets/js/helpers.js');

describe('computeAppleDelay', function() {
  it('returns 3000 when score is 0', function() {
    assert.strictEqual(computeAppleDelay(0), 3000);
  });

  it('decreases delay based on score', function() {
    assert.strictEqual(computeAppleDelay(20), 2000);
  });

  it('never goes below 1000', function() {
    assert.strictEqual(computeAppleDelay(100), 1000);
  });
});
