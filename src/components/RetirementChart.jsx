import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/calculations';

export default function RetirementChart({ data, retirementAge, irr, onIrrChange }) {
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Calculate Y-axis ticks at 1M intervals - always show every 1M increment
  const maxAmount = Math.max(...data.map((d) => d.amount));
  const maxTick = Math.ceil(maxAmount / 1000000) * 1000000;
  const yAxisTicks = [];
  for (let i = 0; i <= maxTick; i += 1000000) {
    yAxisTicks.push(i);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2a2a2a] p-3 border border-[#3a3a3a] rounded-lg shadow-lg">
          <p className="font-semibold text-white">Age {label}</p>
          <p className="text-[#d97706]">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#3a3a3a]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Retirement Fund Growth</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="irr-select" className="text-sm text-[#a0a0a0]">
            IRR:
          </label>
          <select
            id="irr-select"
            value={irr}
            onChange={(e) => onIrrChange(Number(e.target.value))}
            className="bg-[#1f1f1f] border border-[#3a3a3a] text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#d97706] cursor-pointer"
          >
            <option value={3}>3%</option>
            <option value={4}>4%</option>
            <option value={5}>5%</option>
            <option value={6}>6%</option>
            <option value={7}>7%</option>
            <option value={8}>8%</option>
            <option value={9}>9%</option>
            <option value={10}>10%</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
          <XAxis
            dataKey="age"
            label={{ value: 'Age', position: 'bottom', offset: 0, fill: '#a0a0a0' }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            stroke="#3a3a3a"
          />
          <YAxis
            tickFormatter={formatYAxis}
            label={{ value: 'Amount ($)', angle: -90, position: 'left', offset: 15, fill: '#a0a0a0' }}
            tick={{ fontSize: 12, fill: '#a0a0a0' }}
            domain={[0, maxTick]}
            ticks={yAxisTicks}
            interval={0}
            stroke="#3a3a3a"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x={retirementAge}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: `Retirement (${retirementAge})`,
              position: 'top',
              fill: '#ef4444',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#d97706"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#d97706' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
