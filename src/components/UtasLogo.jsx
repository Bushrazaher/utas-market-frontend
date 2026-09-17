import React from 'react';

export default function UtasLogo({ className = "h-14 sm:h-16", showText = false }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <img 
        src="/logo.png" 
        alt="UTAS Market Logo" 
        style={{
          imageRendering: '-webkit-optimize-contrast',
          imageRendering: 'crisp-edges',
          filter: 'contrast(1.08) brightness(1.02)',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        className={`${className} w-auto object-contain transition-transform duration-200 hover:scale-105`}
      />
      {showText && (
        <div className="flex flex-col leading-none text-right">
          <span className="font-black text-sm tracking-wider text-black">
            UTAS <span className="text-[#1493d8]">MARKET</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">الحرم الجامعي</span>
        </div>
      )}
    </div>
  );
}