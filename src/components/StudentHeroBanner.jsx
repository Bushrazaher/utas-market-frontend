import React from 'react';
import { Store, Compass, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function StudentHeroBanner({ setCurrentView, language = 'ar' }) {
  const isEn = language === 'en';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#1493d8]/30 text-white p-8 sm:p-12 md:p-16 border border-slate-800 shadow-2xl select-none" dir={isEn ? 'ltr' : 'rtl'}>
      
       {/* تأثيرات الإضاءة الخلفية الناعمة */}
       <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1493d8]/20 rounded-full blur-3xl pointer-events-none"></div>
       <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

       <div className="relative z-10 max-w-3xl space-y-6">
         
         {/* شارة التميز الأكاديمي */}
         <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-sky-300">
           <Sparkles size={14} className="text-amber-400 animate-pulse" />
           <span>{isEn ? 'UTAS Student Marketplace' : 'المنصة الطلابية الرسمية — UTAS Market'}</span>
         </div>

         {/* العنوان الرئيسي الجذاب */}
         <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
           {isEn ? 'Smart & Easy Student Commerce' : 'تجارة طلابية ذكية وسهلة'} <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1493d8] to-sky-300">
             {isEn ? 'For Sellers & Buyers' : 'لكل بائع ومشتري في الحرم الجامعي'}
           </span>
         </h1>

         {/* الوصف التعريفي المزدوج */}
         <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
           {isEn 
             ? 'Create your student store in minutes, list academic notes, projects, or food items, and shop securely from your peers with campus delivery.' 
             : 'أنشئ متجرك الطلابي في دقائق، اعرض مذكراتك، مشاريعك البرمجية، أو مأكولاتك، وتسوق بكل ثقة وأمان من زملائك مع خيارات الاستلام المباشر.'}
         </p>

         {/* الأزرار التفاعلية المزدوجة (للتاجر وللمشتري) */}
         <div className="flex flex-wrap items-center gap-4 pt-2">
           
           {/* زر خاص بالبائعين */}
           <button
             onClick={() => setCurrentView('seller')}
             className="tactile-btn px-7 py-3.5 bg-[#1493d8] hover:bg-[#117bb5] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center gap-2.5 cursor-pointer group"
           >
             <Store size={18} />
             <span>{isEn ? 'Open Your Store Free' : 'ابدأ متجرك مجاناً (للبائعين)'}</span>
             <ArrowRight size={16} className="rtl:-scale-x-100 group-hover:translate-x-1 transition-transform" />
           </button>

           {/* زر خاص بالمشترين */}
           <button
             onClick={() => setCurrentView('explore')}
             className="tactile-btn px-7 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-2.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
           >
             <Compass size={18} className="text-[#1493d8]" />
             <span>{isEn ? 'Explore Marketplace' : 'تصفح السوق (للمشترين)'}</span>
           </button>

         </div>

         {/* مميزات سريعة في الأسفل */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
           <div className="flex items-center gap-2">
             <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
             <span>متاجر طلابية معتمَدة رسمياً</span>
           </div>
           <div className="flex items-center gap-2">
             <Zap size={16} className="text-amber-400 shrink-0" />
             <span>إدارة طلبات فورية ولحظية</span>
           </div>
           <div className="flex items-center gap-2">
             <Store size={16} className="text-sky-400 shrink-0" />
             <span>لوحة تحكم مستقلة لكل بائع</span>
           </div>
         </div>

       </div>
    </div>
  );
}