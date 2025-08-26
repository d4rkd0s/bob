function computeAppleDelay(score) {
  return Math.max(3000 - score * 50, 1000);
}

if (typeof module !== 'undefined') {
  module.exports = { computeAppleDelay };
}
