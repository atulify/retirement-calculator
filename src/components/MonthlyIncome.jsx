import { useState } from 'react';
import { formatCurrency } from '../utils/calculations';

// Get withdrawal rate based on age (RRIF minimum withdrawal rates + 0.25%)
function getWithdrawalRate(age) {
  if (age >= 95) return 0.2025; // 20.00% + 0.25%
  if (age >= 94) return 0.1904; // 18.79% + 0.25%
  if (age >= 93) return 0.1659; // 16.34% + 0.25%
  if (age >= 92) return 0.1474; // 14.49% + 0.25%
  if (age >= 91) return 0.1331; // 13.06% + 0.25%
  if (age >= 90) return 0.1217; // 11.92% + 0.25%
  if (age >= 89) return 0.1124; // 10.99% + 0.25%
  if (age >= 88) return 0.1046; // 10.21% + 0.25%
  if (age >= 87) return 0.0980; // 9.55% + 0.25%
  if (age >= 86) return 0.0924; // 8.99% + 0.25%
  if (age >= 85) return 0.0876; // 8.51% + 0.25%
  if (age >= 84) return 0.0833; // 8.08% + 0.25%
  if (age >= 83) return 0.0796; // 7.71% + 0.25%
  if (age >= 82) return 0.0763; // 7.38% + 0.25%
  if (age >= 81) return 0.0733; // 7.08% + 0.25%
  if (age >= 80) return 0.0707; // 6.82% + 0.25%
  if (age >= 79) return 0.0683; // 6.58% + 0.25%
  if (age >= 78) return 0.0661; // 6.36% + 0.25%
  if (age >= 77) return 0.0642; // 6.17% + 0.25%
  if (age >= 76) return 0.0623; // 5.98% + 0.25%
  if (age >= 75) return 0.0607; // 5.82% + 0.25%
  if (age >= 74) return 0.0592; // 5.67% + 0.25%
  if (age >= 73) return 0.0578; // 5.53% + 0.25%
  if (age >= 72) return 0.0565; // 5.40% + 0.25%
  if (age >= 71) return 0.0553; // 5.28% + 0.25%
  if (age === 65) return 0.05; // 5% for age 65
  return 0.07; // Default for ages below 71 (except 65)
}

// Calculate fund value and monthly income at target ages
function calculateIncomeAtAges(fundAtRetirement, retirementAge, annualReturn, inflationRate, currentAge) {
  const IRR = annualReturn / 100;
  const INFLATION_RATE = inflationRate / 100;
  const thisYear = new Date().getFullYear();
  const targetAges = [65, 70, 75, 80, 85];
  const results = [];

  for (const targetAge of targetAges) {
    if (targetAge < retirementAge) continue;

    let fund = fundAtRetirement;

    // Simulate year by year from retirement to target age
    for (let age = retirementAge; age < targetAge; age++) {
      // First grow the fund
      fund = fund * (1 + IRR);
      // Then withdraw based on age bracket
      const withdrawalRate = getWithdrawalRate(age);
      const withdrawal = fund * withdrawalRate;
      fund = fund - withdrawal;
    }

    // At target age, calculate the monthly income based on current fund
    const withdrawalRate = getWithdrawalRate(targetAge);
    const annualIncome = fund * withdrawalRate;
    const monthlyIncome = annualIncome / 12;

    // Calculate the target year and years until then
    const yearsFromNow = targetAge - currentAge;
    const targetYear = thisYear + yearsFromNow;

    // Adjust for inflation: convert future dollars to today's dollars
    const inflationFactor = Math.pow(1 + INFLATION_RATE, yearsFromNow);
    const monthlyIncomeToday = monthlyIncome / inflationFactor;

    results.push({
      age: targetAge,
      targetYear,
      fundValue: Math.round(fund),
      monthlyIncome: Math.round(monthlyIncome),
      monthlyIncomeToday: Math.round(monthlyIncomeToday),
      withdrawalRate: withdrawalRate * 100,
    });
  }

  return results;
}

export default function MonthlyIncome({ retirementAge, fundAtRetirement, allGrowthData, irr, currentAge }) {
  const thisYear = new Date().getFullYear();
  const [showWithdrawalRates, setShowWithdrawalRates] = useState(false);
  const [annualReturn, setAnnualReturn] = useState(4);
  const [inflationRate, setInflationRate] = useState(2.5);
  const incomeData = calculateIncomeAtAges(fundAtRetirement, retirementAge, annualReturn, inflationRate, currentAge);

  const selectClasses = 'bg-[#1f1f1f] border border-[#3a3a3a] text-white rounded px-2 py-0.5 text-sm focus:outline-none focus:border-[#d97706] cursor-pointer';

  if (incomeData.length === 0) {
    return (
      <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3a3a3a]">
        <h2 className="text-xl font-bold text-white mb-4">Estimated Monthly Income</h2>
        <p className="text-[#a0a0a0]">
          Retirement age must be 85 or earlier to show income projections.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3a3a3a]">
      <h2 className="text-xl font-bold text-white mb-4">Estimated Monthly Income</h2>
      <ul className="text-sm text-[#a0a0a0] mb-6 space-y-2">
        <li className="flex items-center gap-2">
          <span>Annual rate of return:</span>
          <select
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            className={selectClasses}
          >
            <option value={3}>3%</option>
            <option value={4}>4%</option>
            <option value={5}>5%</option>
            <option value={6}>6%</option>
            <option value={7}>7%</option>
          </select>
        </li>
        <li className="flex items-center gap-2">
          <span>Inflation:</span>
          <select
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className={selectClasses}
          >
            <option value={2}>2%</option>
            <option value={2.5}>2.5%</option>
            <option value={3}>3%</option>
            <option value={3.5}>3.5%</option>
            <option value={4}>4%</option>
          </select>
        </li>
      </ul>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3a3a3a]">
              <th className="text-left py-2 px-3 text-[#a0a0a0] font-medium"></th>
              {incomeData.map((data) => (
                <th key={data.age} className="text-center py-2 px-3 text-white font-semibold">
                  <div>Age {data.age}</div>
                  <div className="text-xs text-[#6a6a6a] font-normal">({data.targetYear})</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="py-2 px-3 text-[#a0a0a0]">Fund Value</td>
              {incomeData.map((data) => (
                <td key={data.age} className="text-center py-2 px-3 text-white">
                  {formatCurrency(data.fundValue)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="py-2 px-3 text-[#a0a0a0]">Withdrawal Rate</td>
              {incomeData.map((data) => {
                const rate = Math.round(data.withdrawalRate * 10) / 10;
                const formattedRate = rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(1);
                return (
                  <td key={data.age} className="text-center py-2 px-3 text-[#a0a0a0]">
                    {formattedRate}%
                  </td>
                );
              })}
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="py-2 px-3 text-[#a0a0a0]">
                <div>Monthly Income</div>
                <div className="text-xs text-[#6a6a6a]">(nominal)</div>
              </td>
              {incomeData.map((data) => (
                <td key={data.age} className="text-center py-2 px-3">
                  <span className="text-base text-white">
                    {formatCurrency(data.monthlyIncome)}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 px-3 text-[#a0a0a0]">
                <div>Monthly Income</div>
                <div className="text-xs text-[#6a6a6a]">({thisYear} dollars)</div>
              </td>
              {incomeData.map((data) => (
                <td key={data.age} className="text-center py-2 px-3">
                  <span className="text-base font-bold text-[#d97706]">
                    {formatCurrency(data.monthlyIncomeToday)}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div id="withdrawal-rates-section" className="mt-6">
        <button
          onClick={() => setShowWithdrawalRates(!showWithdrawalRates)}
          className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
        >
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: showWithdrawalRates ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            &#9654;
          </span>
          <span>Withdrawal rates by age (RRIF minimum + 0.25%)</span>
        </button>

        {showWithdrawalRates && (
          <div className="mt-3 p-3 bg-[#1f1f1f] rounded-lg inline-block">
            <table className="w-auto">
          <thead>
            <tr className="border-b border-[#3a3a3a]">
              <th className="text-center py-1 px-2 text-xs text-[#a0a0a0] font-medium">Age</th>
              <th className="text-center py-1 px-2 text-xs text-[#a0a0a0] font-medium">Withdrawal Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">71</td>
              <td className="text-center py-1 px-2 text-xs text-white">5.53%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">72</td>
              <td className="text-center py-1 px-2 text-xs text-white">5.65%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">73</td>
              <td className="text-center py-1 px-2 text-xs text-white">5.78%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">74</td>
              <td className="text-center py-1 px-2 text-xs text-white">5.92%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">75</td>
              <td className="text-center py-1 px-2 text-xs text-white">6.07%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">76</td>
              <td className="text-center py-1 px-2 text-xs text-white">6.23%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">77</td>
              <td className="text-center py-1 px-2 text-xs text-white">6.42%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">78</td>
              <td className="text-center py-1 px-2 text-xs text-white">6.61%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">79</td>
              <td className="text-center py-1 px-2 text-xs text-white">6.83%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">80</td>
              <td className="text-center py-1 px-2 text-xs text-white">7.07%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">81</td>
              <td className="text-center py-1 px-2 text-xs text-white">7.33%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">82</td>
              <td className="text-center py-1 px-2 text-xs text-white">7.63%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">83</td>
              <td className="text-center py-1 px-2 text-xs text-white">7.96%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">84</td>
              <td className="text-center py-1 px-2 text-xs text-white">8.33%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">85</td>
              <td className="text-center py-1 px-2 text-xs text-white">8.76%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">86</td>
              <td className="text-center py-1 px-2 text-xs text-white">9.24%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">87</td>
              <td className="text-center py-1 px-2 text-xs text-white">9.80%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">88</td>
              <td className="text-center py-1 px-2 text-xs text-white">10.46%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">89</td>
              <td className="text-center py-1 px-2 text-xs text-white">11.24%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">90</td>
              <td className="text-center py-1 px-2 text-xs text-white">12.17%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">91</td>
              <td className="text-center py-1 px-2 text-xs text-white">13.31%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">92</td>
              <td className="text-center py-1 px-2 text-xs text-white">14.74%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">93</td>
              <td className="text-center py-1 px-2 text-xs text-white">16.59%</td>
            </tr>
            <tr className="border-b border-[#3a3a3a]">
              <td className="text-center py-1 px-2 text-xs text-white">94</td>
              <td className="text-center py-1 px-2 text-xs text-white">19.04%</td>
            </tr>
            <tr>
              <td className="text-center py-1 px-2 text-xs text-white">95+</td>
              <td className="text-center py-1 px-2 text-xs text-white">20.25%</td>
            </tr>
          </tbody>
        </table>
          </div>
        )}
      </div>
    </div>
  );
}
