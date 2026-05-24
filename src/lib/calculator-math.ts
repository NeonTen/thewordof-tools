export interface BmiResult {
  score: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
}

export function calculateBmi(weight: number, height: number, isMetric: boolean): BmiResult {
  const score = isMetric 
    ? weight / Math.pow(height / 100, 2)
    : (weight * 703) / Math.pow(height, 2);
  
  let category: BmiResult["category"] = "Normal";
  if (score < 18.5) category = "Underweight";
  else if (score >= 18.5 && score < 25) category = "Normal";
  else if (score >= 25 && score < 30) category = "Overweight";
  else category = "Obese";

  return { score: parseFloat(score.toFixed(1)), category };
}

export function calculateAspectRatio(w: number, h: number, targetVal: number, mode: "width" | "height"): number {
  if (mode === "width") {
    return parseFloat(((targetVal * h) / w).toFixed(2));
  } else {
    return parseFloat(((targetVal * w) / h).toFixed(2));
  }
}

export function getGcd(a: number, b: number): number {
  return b === 0 ? a : getGcd(b, a % b);
}

export function calculateLineHeight(baseSize: number, value: number, unit: "px" | "rem" | "percent"): number {
  if (unit === "px") {
    return parseFloat((value / baseSize).toFixed(3));
  } else if (unit === "rem") {
    return value;
  } else {
    return parseFloat((value / 100).toFixed(3));
  }
}

export function pxToRem(px: number, base: number = 16): number {
  return parseFloat((px / base).toFixed(4));
}

export function remToPx(rem: number, base: number = 16): number {
  return parseFloat((rem * base).toFixed(4));
}

export interface CompoundInterestInput {
  principal: number;
  monthlyContrib: number;
  rate: number;
  tenureYears: number;
  frequency: "monthly" | "quarterly" | "annually";
  inflationRate: number;
}

export interface CompoundInterestYearData {
  year: number;
  totalInvested: number;
  nominalValue: number;
  realValue: number;
}

export function calculateCompoundInterest(input: CompoundInterestInput): {
  nominalFutureValue: number;
  realFutureValue: number;
  totalInvested: number;
  totalInterestEarned: number;
  yearlyBreakdown: CompoundInterestYearData[];
} {
  const { principal, monthlyContrib, rate, tenureYears, frequency, inflationRate } = input;
  let freqFactor = 12;
  if (frequency === "quarterly") freqFactor = 4;
  else if (frequency === "annually") freqFactor = 1;

  const rPerPeriod = (rate / 100) / freqFactor;
  const periodsPerYear = freqFactor;
  
  let nominalValue = principal;
  let totalInvested = principal;
  const yearlyBreakdown: CompoundInterestYearData[] = [];

  for (let year = 1; year <= tenureYears; year++) {
    for (let p = 0; p < periodsPerYear; p++) {
      const contributionPerPeriod = (monthlyContrib * 12) / periodsPerYear;
      nominalValue = (nominalValue + contributionPerPeriod) * (1 + rPerPeriod);
      totalInvested += contributionPerPeriod;
    }

    yearlyBreakdown.push({
      year,
      totalInvested: Math.round(totalInvested),
      nominalValue: Math.round(nominalValue),
      realValue: Math.round(nominalValue / Math.pow(1 + inflationRate / 100, year)),
    });
  }

  const finalNominal = Math.round(nominalValue);
  const finalReal = Math.round(nominalValue / Math.pow(1 + inflationRate / 100, tenureYears));
  const finalInvested = Math.round(totalInvested);

  return {
    nominalFutureValue: finalNominal,
    realFutureValue: finalReal,
    totalInvested: finalInvested,
    totalInterestEarned: Math.max(0, finalNominal - finalInvested),
    yearlyBreakdown,
  };
}

export interface SalaryBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
}

export function calculateSalaryToHourly(
  amount: number,
  frequency: "annual" | "monthly" | "weekly" | "hourly",
  hoursPerWeek: number = 40,
  weeksPerYear: number = 52
): SalaryBreakdown {
  let annual = 0;
  const totalHours = hoursPerWeek * weeksPerYear;

  if (frequency === "annual") annual = amount;
  else if (frequency === "monthly") annual = amount * 12;
  else if (frequency === "weekly") annual = amount * weeksPerYear;
  else if (frequency === "hourly") annual = amount * totalHours;

  const hourly = annual / totalHours;
  const weekly = annual / weeksPerYear;
  const biweekly = weekly * 2;
  const monthly = annual / 12;
  const daily = weekly / 5;

  return {
    hourly: parseFloat(hourly.toFixed(2)),
    daily: parseFloat(daily.toFixed(2)),
    weekly: parseFloat(weekly.toFixed(2)),
    biweekly: parseFloat(biweekly.toFixed(2)),
    monthly: parseFloat(monthly.toFixed(2)),
    annual: parseFloat(annual.toFixed(2)),
  };
}
