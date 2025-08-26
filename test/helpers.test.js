const assert = require('assert');
const { computeAppleDelay, getClosest } = require('../assets/js/helpers.js');

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

describe('getClosest', function() {
  it('returns the nearest object', function() {
    const game = { physics: { arcade: { distanceBetween: (a, b) => Math.hypot(a.x - b.x, a.y - b.y) } } };
    const target = { x: 0, y: 0 };
    const group = [
      { x: 5, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 4 }
    ];
    group.forEachAlive = function(cb, ctx) { this.forEach(function(child) { cb.call(ctx, child); }); };
    const closest = getClosest(game, target, group);
    assert.strictEqual(closest, group[1]);
  });
});
