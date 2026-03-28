import { useMemo, useState } from 'react';
import RetirementChart from '../components/RetirementChart';
import MonthlyIncome from '../components/MonthlyIncome';
import { calculateGrowth } from '../utils/calculations';

export default function ResultsPage({ data, onRestart }) {
  const [irr, setIrr] = useState(data?.irr || 5);

  if (!data) {
    return null;
  }

  const { currentAge, savings, retirementAge } = data;

  const allGrowthData = useMemo(() => {
    return calculateGrowth(currentAge, savings, irr);
  }, [currentAge, savings, irr]);

  const growthData = allGrowthData.filter((d) => d.age <= 70);
  const fundAtRetirement = allGrowthData.find((d) => d.age === retirementAge)?.amount || 0;

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Retirement Analysis
          </h1>
          <p className="text-[#a0a0a0]">
            Based on {irr}% annual return, retiring at age {retirementAge}
          </p>
        </div>

        <div className="space-y-8">
          <RetirementChart
            data={growthData}
            retirementAge={retirementAge}
            irr={irr}
            onIrrChange={setIrr}
          />
          <MonthlyIncome
            retirementAge={retirementAge}
            fundAtRetirement={fundAtRetirement}
            allGrowthData={allGrowthData}
            irr={irr}
            currentAge={currentAge}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onRestart}
            className="bg-[#3a3a3a] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#4a4a4a] transition-colors border border-[#4a4a4a]"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
