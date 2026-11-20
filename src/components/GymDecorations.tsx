import React from 'react';

// Detailed Hex Dumbbell SVG Component
export const HeavyDumbbellIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <defs>
      <linearGradient id="metalBar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9CA3AF" />
        <stop offset="50%" stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
      <linearGradient id="ironPlate" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#27272A" />
        <stop offset="50%" stopColor="#18181B" />
        <stop offset="100%" stopColor="#09090B" />
      </linearGradient>
      <linearGradient id="redRing" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>

    {/* Center Barbell Knurled Bar */}
    <rect x="25" y="44" width="50" height="12" rx="3" fill="url(#metalBar)" />
    {/* Knurling Lines on Bar */}
    <line x1="32" y1="44" x2="32" y2="56" stroke="#374151" strokeWidth="1" strokeDasharray="1 1" />
    <line x1="40" y1="44" x2="40" y2="56" stroke="#374151" strokeWidth="1" strokeDasharray="1 1" />
    <line x1="48" y1="44" x2="48" y2="56" stroke="#374151" strokeWidth="1" strokeDasharray="1 1" />
    <line x1="60" y1="44" x2="60" y2="56" stroke="#374151" strokeWidth="1" strokeDasharray="1 1" />
    <line x1="68" y1="44" x2="68" y2="56" stroke="#374151" strokeWidth="1" strokeDasharray="1 1" />

    {/* Left Hex Dumbbell Head */}
    <path
      d="M10 32 L25 22 L25 78 L10 68 L5 50 Z"
      fill="url(#ironPlate)"
      stroke="#3F3F46"
      strokeWidth="2"
    />
    <path d="M22 25 L22 75" stroke="url(#redRing)" strokeWidth="3" />
    <path
      d="M12 36 L20 28 L20 72 L12 64 Z"
      fill="#18181B"
      stroke="#27272A"
      strokeWidth="1"
    />

    {/* Right Hex Dumbbell Head */}
    <path
      d="M90 32 L75 22 L75 78 L90 68 L95 50 Z"
      fill="url(#ironPlate)"
      stroke="#3F3F46"
      strokeWidth="2"
    />
    <path d="M78 25 L78 75" stroke="url(#redRing)" strokeWidth="3" />
    <path
      d="M88 36 L80 28 L80 72 L88 64 Z"
      fill="#18181B"
      stroke="#27272A"
      strokeWidth="1"
    />

    {/* Weight Label */}
    <text x="50" y="52" fill="#DC2626" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
      35KG
    </text>
  </svg>
);

// 20KG Olympic Barbell Iron Weight Plate SVG
export const OlympicPlateIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 60,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <defs>
      <radialGradient id="plateRadial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#27272A" />
        <stop offset="60%" stopColor="#18181B" />
        <stop offset="100%" stopColor="#09090B" />
      </radialGradient>
      <linearGradient id="chromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E7EB" />
        <stop offset="50%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#4B5563" />
      </linearGradient>
    </defs>

    {/* Outer Iron Plate Circle */}
    <circle cx="50" cy="50" r="46" fill="url(#plateRadial)" stroke="#3F3F46" strokeWidth="3" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="6 3" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="#27272A" strokeWidth="2" />

    {/* Embossed Text Arc */}
    <path id="textPath" d="M 22,50 A 28,28 0 1,1 78,50" fill="none" />
    <text fill="#A1A1AA" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
      <textPath href="#textPath" startOffset="50%" textAnchor="middle">
        NITISH SONI • 20KG
      </textPath>
    </text>

    {/* Center Hole Chrome Ring */}
    <circle cx="50" cy="50" r="12" fill="#09090B" stroke="url(#chromeRing)" strokeWidth="3" />
    <circle cx="50" cy="50" r="7" fill="#000000" />
  </svg>
);

// Cast Iron Kettlebell SVG
export const KettlebellIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <defs>
      <linearGradient id="kbBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3F3F46" />
        <stop offset="60%" stopColor="#18181B" />
        <stop offset="100%" stopColor="#09090B" />
      </linearGradient>
    </defs>

    {/* Handle */}
    <path
      d="M30 40 C30 15, 70 15, 70 40 L60 40 C60 25, 40 25, 40 40 Z"
      fill="url(#kbBody)"
      stroke="#52525B"
      strokeWidth="2"
    />
    <rect x="38" y="24" width="24" height="4" rx="2" fill="#DC2626" />

    {/* Ball Body */}
    <circle cx="50" cy="62" r="32" fill="url(#kbBody)" stroke="#27272A" strokeWidth="3" />
    <circle cx="50" cy="62" r="28" fill="none" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 2" />

    {/* Stamp */}
    <text x="50" y="65" fill="#E4E4E7" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="middle">
      24KG
    </text>
  </svg>
);

// Aesthetic Gym Rack & Barbells Background Backdrop Pattern
export const GymRackDecorativePattern: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15 select-none">
    <div className="absolute -left-10 top-10 flex flex-col space-y-4 transform -rotate-12">
      <HeavyDumbbellIcon size={120} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
      <OlympicPlateIcon size={140} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
    </div>

    <div className="absolute -right-12 bottom-4 flex flex-col items-end space-y-3 transform rotate-12">
      <KettlebellIcon size={110} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
      <HeavyDumbbellIcon size={130} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
    </div>
  </div>
);
