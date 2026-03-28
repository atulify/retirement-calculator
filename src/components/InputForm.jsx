import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InputForm() {
  const navigate = useNavigate();
  const [currentAge, setCurrentAge] = useState(45);
  const [savings, setSavings] = useState('');
  const [irr, setIrr] = useState(7);
  const [retirementAge, setRetirementAge] = useState(65);
  const maxSavings = 10_000_000;

  const currentAgeOptions = Array.from({ length: 26 }, (_, i) => 45 + i);
  const irrOptions = Array.from({ length: 14 }, (_, i) => 2 + i);
  const retirementAgeOptions = Array.from({ length: 16 }, (_, i) => 55 + i).filter(
    (age) => age > currentAge
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const savingsNum = parseFloat(savings.replace(/,/g, ''));
    if (isNaN(savingsNum) || savingsNum <= 0) {
      alert('Please enter a valid savings amount');
      return;
    }
    if (savingsNum > maxSavings) {
      alert(`Please enter a savings amount of $${maxSavings.toLocaleString()} or less`);
      return;
    }
    navigate('/results', {
      state: {
        currentAge,
        savings: savingsNum,
        irr,
        retirementAge,
      },
    });
  };

  const handleSavingsChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      const clampedValue = Math.min(Number(value), maxSavings);
      setSavings(clampedValue.toLocaleString());
    } else {
      setSavings('');
    }
  };

  const handleCurrentAgeChange = (e) => {
    const newAge = Number(e.target.value);
    setCurrentAge(newAge);
    if (retirementAge <= newAge) {
      setRetirementAge(newAge + 1);
    }
  };

  const selectClasses =
    'w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] outline-none';
  const inputClasses =
    'w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          Current Age
        </label>
        <select
          value={currentAge}
          onChange={handleCurrentAgeChange}
          className={selectClasses}
        >
          {currentAgeOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          Retirement Savings ($)
        </label>
        <input
          type="text"
          value={savings}
          onChange={handleSavingsChange}
          placeholder="500,000"
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          Expected Rate of Return (IRR)
        </label>
        <select
          value={irr}
          onChange={(e) => setIrr(Number(e.target.value))}
          className={selectClasses}
        >
          {irrOptions.map((rate) => (
            <option key={rate} value={rate}>
              {rate}%
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          Desired Retirement Age
        </label>
        <select
          value={retirementAge}
          onChange={(e) => setRetirementAge(Number(e.target.value))}
          className={selectClasses}
        >
          {retirementAgeOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-[#d97706] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b45309] transition-colors"
      >
        Analyze
      </button>
    </form>
  );
}
