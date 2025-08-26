function computeAppleDelay(score) {
  return Math.max(3000 - score * 50, 1000);
}

function getClosest(game, target, group) {
  var closest = null;
  var shortest = Number.MAX_VALUE;
  if (group && group.forEachAlive) {
    group.forEachAlive(function(child) {
      var dist = game.physics.arcade.distanceBetween(target, child);
      if (dist < shortest) {
        shortest = dist;
        closest = child;
      }
    });
  }
  return closest;
}

if (typeof module !== 'undefined') {
  module.exports = { computeAppleDelay, getClosest };
}
