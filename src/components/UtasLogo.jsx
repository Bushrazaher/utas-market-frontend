import React from 'react';

export default function UtasLogo({ className = "h-14 w-auto" }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="flex items-center font-black tracking-tight text-3xl sm:text-4xl">
        <span className="text-white drop-shadow-md">AS</span>
        <span className="text-[#1493d8] drop-shadow-md">UT</span>
      </div>
      <span className="text-[8px] sm:text-[9px] font-black tracking-[0.25em] text-sky-400 uppercase -mt-1">
        UTAS MARKET
      </span>
    </div>
  );
}