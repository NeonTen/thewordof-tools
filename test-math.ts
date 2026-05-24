import { 
  calculateBmi, 
  calculateAspectRatio, 
  calculateLineHeight, 
  pxToRem, 
  calculateCompoundInterest,
  calculateSalaryToHourly
} from "./src/lib/calculator-math";

function assert(condition: boolean, message?: string) {
  if (!condition) throw new Error(message || "Assertion failed");
}

console.log("Running Core Math Tests...");

// 1. BMI Tests
const bmiMetric = calculateBmi(70, 175, true); // 70kg, 175cm
assert(bmiMetric.score === 22.9, `Expected 22.9, got ${bmiMetric.score}`);
assert(bmiMetric.category === "Normal", `Expected Normal, got ${bmiMetric.category}`);

// 2. Aspect Ratio Tests
const aspect = calculateAspectRatio(16, 9, 1920, "width");
assert(aspect === 1080, `Expected 1080, got ${aspect}`);

// 3. Line-height Tests
const relativeLh = calculateLineHeight(16, 24, "px");
assert(relativeLh === 1.5, `Expected 1.5, got ${relativeLh}`);

// 4. PX to REM Tests
const rem = pxToRem(20, 16);
assert(rem === 1.25, `Expected 1.25, got ${rem}`);

// 5. Compound Interest
const ci = calculateCompoundInterest({
  principal: 10000,
  monthlyContrib: 500,
  rate: 8,
  tenureYears: 5,
  frequency: "monthly",
  inflationRate: 3
});
assert(ci.totalInvested === 40000, `Expected 40000 invested, got ${ci.totalInvested}`);
assert(ci.nominalFutureValue > ci.totalInvested, "Value should compounding upwards");

// 6. Salary to Hourly
const salary = calculateSalaryToHourly(52000, "annual", 40, 52);
assert(salary.hourly === 25, `Expected 25, got ${salary.hourly}`);

console.log("All Core Math Tests Passed Successfully!");
