export function calculateGrowth(currentAge, principal, irr) {
  const data = [];
  const rate = irr / 100;

  for (let age = currentAge; age <= 100; age++) {
    const years = age - currentAge;
    const amount = principal * Math.pow(1 + rate, years);
    data.push({
      age,
      amount: Math.round(amount),
    });
  }

  return data;
}

export function calculateMonthlyIncome(fundAtRetirement, withdrawalRate = 0.07) {
  const annualIncome = fundAtRetirement * withdrawalRate;
  return Math.round(annualIncome / 12);
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}
