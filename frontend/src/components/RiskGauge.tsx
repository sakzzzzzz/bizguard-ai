import React from 'react';

interface RiskGaugeProps {
  probabilityPercent: number;
  riskLevel: string;
  healthScore?: number;
  runwayMonths?: number;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  probabilityPercent,
  riskLevel,
  healthScore,
  runwayMonths,
  size = 200
}) => {
  const clampedProb = Math.min(Math.max(probabilityPercent, 0), 100);
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // 180-deg arc
  const offset = circumference - (clampedProb / 100) * circumference;

  let color = '#10b981'; // Emerald Green
  let tagClass = 'tag-green';
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (clampedProb > 60) {
    color = '#ef4444'; // Coral Red
    tagClass = 'tag-red';
    glowColor = 'rgba(239, 68, 68, 0.4)';
  } else if (clampedProb > 30) {
    color = '#f59e0b'; // Amber
    tagClass = 'tag-yellow';
    glowColor = 'rgba(245, 158, 11, 0.4)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: size, margin: '0 auto' }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <defs>
          <linearGradient id="startupGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Value Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#gaugeGlow)"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease' }}
        />

        {/* Center Value */}
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          fontSize={size * 0.19}
          fontWeight="800"
          fill="#ffffff"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          {clampedProb.toFixed(1)}%
        </text>

        <text
          x={size / 2}
          y={size / 2 + 16}
          textAnchor="middle"
          fontSize={11}
          fontWeight="700"
          fill="#94a3b8"
          letterSpacing="0.5"
        >
          FAILURE PROBABILITY
        </text>
      </svg>

      <div className={`risk-level-tag ${tagClass}`} style={{ marginTop: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
        {riskLevel}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 14, fontSize: 12, color: '#cbd5e1' }}>
        {runwayMonths !== undefined && (
          <div>
            Runway: <strong style={{ color: runwayMonths < 6 ? '#ef4444' : runwayMonths < 12 ? '#f59e0b' : '#34d399' }}>{runwayMonths} Mos</strong>
          </div>
        )}
        {healthScore !== undefined && (
          <div>
            Health: <strong style={{ color: '#60a5fa' }}>{healthScore} / 100</strong>
          </div>
        )}
      </div>
    </div>
  );
};
