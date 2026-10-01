import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PageHeader({ 
  title, 
  subtitle, 
  onBack, 
  action,
  language = 'ar' 
} ) {
  const isEn = language === 'en';

  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs cursor-pointer"
            title={isEn ? 'Back' : 'رجوع'}
          >
            <ArrowRight size={18} className={isEn ? 'rotate-180' : ''} />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}