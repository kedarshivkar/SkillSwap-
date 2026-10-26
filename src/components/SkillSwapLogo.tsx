import React from 'react';

interface SkillSwapLogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function SkillSwapIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SkillSwap Logo"
    >
      {/* Left Person Head */}
      <circle cx="15.5" cy="12.5" r="4.2" fill="#2563EB" />

      {/* Right Person Head */}
      <circle cx="32.5" cy="12.5" r="4.2" fill="#2563EB" />

      {/* Left Person Curved Body / Exchange Loop */}
      <path 
        d="M15.5 19.5 C15.5 28 21.5 33.5 29.5 33.5 C33.5 33.5 36.5 31.5 38 28.5" 
        stroke="#2563EB" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      {/* Arrow pointing up toward right figure */}
      <path 
        d="M34 29 L38.5 28 L39.5 32.5" 
        stroke="#2563EB" 
        strokeWidth="3.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Right Person Curved Body / Exchange Loop */}
      <path 
        d="M32.5 19.5 C32.5 28 26.5 33.5 18.5 33.5 C14.5 33.5 11.5 31.5 10 28.5" 
        stroke="#2563EB" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      {/* Arrow pointing up toward left figure */}
      <path 
        d="M14 29 L9.5 28 L8.5 32.5" 
        stroke="#2563EB" 
        strokeWidth="3.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export function SkillSwapLogo({ 
  className = "", 
  iconClassName = "w-10 h-10", 
  showText = true 
}: SkillSwapLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <SkillSwapIcon className={`${iconClassName} shrink-0 text-blue-600`} />
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors flex items-center font-['Outfit',sans-serif]">
            Skill<span className="text-blue-600 font-extrabold">Swap</span>
          </span>
          <span className="text-[10px] font-medium tracking-wide text-slate-500">
            Learn. Teach. Grow Together.
          </span>
        </div>
      )}
    </div>
  );
}

export default SkillSwapLogo;
