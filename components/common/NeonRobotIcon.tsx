
import React, { useId } from 'react';

export const NeonRobotIcon: React.FC<{ className?: string }> = ({ className }) => {
  const id = useId();
  const bgId = `bg-${id}`;
  const glowId = `glow-${id}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <radialGradient id={bgId} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#0b2a4a"/>
          <stop offset="100%" stopColor="#020b1a"/>
        </radialGradient>

        <filter id={glowId} x="-200%" y="-200%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="256" height="256" rx="128" fill={`url(#${bgId})`}/>
      <circle cx="128" cy="78" r="62" fill="#3dfcff" opacity="0.12" className="animate-pulse"/>

      <g filter={`url(#${glowId})`} className="animate-float-3d-rotate" style={{ transformOrigin: 'center' }}>
        <rect x="78" y="40" width="100" height="70" rx="20" fill="none" stroke="#3dfcff" strokeWidth="4"/>
        <rect x="96" y="62" width="64" height="28" rx="12" fill="#3dfcff"/>
        <circle cx="118" cy="76" r="4" fill="#02101f"/>
        <circle cx="138" cy="76" r="4" fill="#02101f"/>
        <rect x="64" y="58" width="14" height="34" rx="7" fill="#3dfcff"/>
        <rect x="178" y="58" width="14" height="34" rx="7" fill="#3dfcff"/>
      </g>

      <g filter={`url(#${glowId})`} className="animate-[float-3d-rotate_8s_ease-in-out_infinite_reverse]" style={{ transformOrigin: 'center' }}>
        <rect x="78" y="118" width="100" height="88" rx="18" fill="none" stroke="#3dfcff" strokeWidth="4"/>
        <rect x="102" y="138" width="20" height="20" rx="4" fill="#3dfcff" opacity="0.8"/>
        <rect x="134" y="138" width="20" height="20" rx="4" fill="#3dfcff" opacity="0.8"/>
        <rect x="102" y="170" width="20" height="20" rx="4" fill="#3dfcff" opacity="0.8"/>
        <rect x="134" y="170" width="20" height="20" rx="4" fill="#3dfcff" opacity="0.8"/>
        <rect x="110" y="202" width="36" height="6" rx="3" fill="#3dfcff" className="animate-pulse"/>
      </g>

      <g filter={`url(#${glowId})`}>
        <rect x="56" y="132" width="18" height="72" rx="9" fill="#3dfcff"/>
        <rect x="182" y="132" width="18" height="72" rx="9" fill="#3dfcff"/>
      </g>
    </svg>
  );
};
