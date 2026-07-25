import assert from "assert";

function calculateScoreGain(originalScore: number, improvedScore: number): number {
  return Math.max(0, improvedScore - originalScore);
}

assert.strictEqual(calculateScoreGain(58, 94), 36);
assert.strictEqual(calculateScoreGain(80, 80), 0);
assert.strictEqual(calculateScoreGain(90, 85), 0);
console.log("✅ calculateScoreGain verified");
