import assert from "assert";

function getInitialText(provided?: string): string {
  return provided || "";
}

assert.strictEqual(getInitialText("resume text"), "resume text");
assert.strictEqual(getInitialText(), "");
console.log("✅ getInitialText logic verified");
