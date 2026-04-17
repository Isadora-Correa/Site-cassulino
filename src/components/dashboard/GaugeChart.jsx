import React from 'react';

export default function GaugeChart({ value, min, max, color, unit }) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const angle = (percentage / 100) * 240 - 120; // -120 to 120 degrees
  const circumference = 2 * Math.PI * 52;
  const dashLength = (percentage / 100) * (circumference * 0.667);

  return (
    <div className="flex flex-col items-center justify-center h-full py-2">
      <svg viewBox="0 0 120 100" className="w-full max-w-[160px]">
        {/* Background arc */}
        <circle
          cx="60"
          cy="65"
          r="52"
          fill="none"
          stroke="currentColor"
          className="text-muted/50"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.667} ${circumference}`}
          transform="rotate(-210, 60, 65)"
        />
        {/* Value arc */}
        <circle
          cx="60"
          cy="65"
          r="52"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dashLength} ${circumference}`}
          transform="rotate(-210, 60, 65)"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
        {/* Center value */}
        <text x="60" y="60" textAnchor="middle" className="fill-foreground text-lg font-bold" fontSize="18">
          {typeof value === 'number' ? value.toFixed(value > 100 ? 0 : 1) : value}
        </text>
        <text x="60" y="78" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
          {unit}
        </text>
      </svg>
      <div className="flex justify-between w-full px-4 text-[10px] text-muted-foreground mt-1">
        <span>{min}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}