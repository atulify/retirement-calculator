import { useMemo, useRef, useState } from 'react';
import { formatCurrency } from '../utils/calculations';

const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export default function RetirementChart({ data, retirementAge, irr, onIrrChange }) {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxAmount = data.reduce((max, d) => (d.amount > max ? d.amount : max), 0);
  const maxTick = Math.ceil(maxAmount / 1000000) * 1000000;
  const minAge = data[0]?.age ?? 0;
  const maxAge = data[data.length - 1]?.age ?? 1;

  const width = 600;
  const height = 400;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xScale = (age) => {
    if (maxAge === minAge) return padding.left;
    return padding.left + ((age - minAge) / (maxAge - minAge)) * innerWidth;
  };

  const yScale = (amount) => {
    if (maxTick === 0) return padding.top + innerHeight;
    return padding.top + innerHeight - (amount / maxTick) * innerHeight;
  };

  const linePoints = useMemo(
    () => data.map((d) => `${xScale(d.age)},${yScale(d.amount)}`).join(' '),
    [data, maxAge, minAge, maxTick]
  );

  const yTicks = Array.from({ length: 6 }, (_, index) => (maxTick / 5) * index);
  const xTicks = Array.from({ length: 5 }, (_, index) => {
    if (maxAge === minAge) return minAge;
    return Math.round(minAge + ((maxAge - minAge) / 4) * index);
  });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const clamped = Math.max(padding.left, Math.min(localX, rect.width - padding.right));
    const ratio = (clamped - padding.left) / (rect.width - padding.left - padding.right);
    const ageAtCursor = minAge + ratio * (maxAge - minAge);
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    data.forEach((point, index) => {
      const distance = Math.abs(point.age - ageAtCursor);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    setHoveredIndex(nearestIndex);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  const hoveredPoint = hoveredIndex != null ? data[hoveredIndex] : null;
  const tooltipPosition = (() => {
    if (!hoveredPoint || !containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / width;
    const scaleY = rect.height / height;
    return {
      left: xScale(hoveredPoint.age) * scaleX,
      top: yScale(hoveredPoint.amount) * scaleY,
    };
  })();

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
      <div className="relative" ref={containerRef}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="400"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <rect x={0} y={0} width={width} height={height} fill="#2a2a2a" />
          {yTicks.map((tick) => {
            const y = yScale(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#3a3a3a"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#a0a0a0"
                >
                  {formatYAxis(tick)}
                </text>
              </g>
            );
          })}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#3a3a3a"
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#3a3a3a"
          />
          {xTicks.map((tick) => {
            const x = xScale(tick);
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={height - padding.bottom}
                  x2={x}
                  y2={height - padding.bottom + 6}
                  stroke="#3a3a3a"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 22}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#a0a0a0"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          <line
            x1={xScale(retirementAge)}
            y1={padding.top}
            x2={xScale(retirementAge)}
            y2={height - padding.bottom}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <text
            x={xScale(retirementAge)}
            y={padding.top + 12}
            textAnchor="middle"
            fontSize="12"
            fill="#ef4444"
          >
            {`Retirement (${retirementAge})`}
          </text>
          <polyline
            fill="none"
            stroke="#d97706"
            strokeWidth={3}
            points={linePoints}
          />
          {hoveredPoint ? (
            <circle
              cx={xScale(hoveredPoint.age)}
              cy={yScale(hoveredPoint.amount)}
              r={6}
              fill="#d97706"
            />
          ) : null}
        </svg>
        {hoveredPoint && tooltipPosition ? (
          <div
            className="absolute bg-[#2a2a2a] p-3 border border-[#3a3a3a] rounded-lg shadow-lg pointer-events-none"
            style={{
              left: tooltipPosition.left,
              top: tooltipPosition.top - 16,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-semibold text-white">Age {hoveredPoint.age}</p>
            <p className="text-[#d97706]">{formatCurrency(hoveredPoint.amount)}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
