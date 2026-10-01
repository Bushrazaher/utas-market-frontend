import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [], language = 'ar' }) {
  const isEn = language === 'en';
  const Chevron = isEn ? ChevronRight : ChevronLeft;

  return (
    <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 select-none" dir={isEn ? 'ltr' : 'rtl'}>
      <button 
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 hover:text-[#1493d8] transition"
      >
        <Home size={14} />
        <span>{isEn ? 'Home' : 'الرئيسية'}</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Chevron size={14} className="text-slate-400 shrink-0" />
          {item.onClick ? (
            <button 
              onClick={item.onClick}
              className="hover:text-[#1493d8] transition truncate max-w-[150px]"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-900 dark:text-white truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}