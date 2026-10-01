import React from 'react';
import StudentHeroBanner from './StudentHeroBanner';
import { Store, Compass, ArrowRight, Sparkles, Package, ShoppingBag } from 'lucide-react';

export default function HomeView({ setCurrentView, language = 'ar', theme = 'light', stores = [] }) {
  const isEn = language === 'en';

  return (
    <div className="space-y-8" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* لوحة الإعلانات التفاعلية الرئيسية (مستوحاة من سلة) */}
      <StudentHeroBanner setCurrentView={setCurrentView} language={language} />

      {/* أقسام سريعة تفاعلية (للبائع والمشتري) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* كارد التجار والبائعين */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#1493d8] bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-lg inline-block">
              {isEn ? 'For New Sellers' : 'استوديو التجار'}
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isEn ? 'Do you have products to sell?' : 'هل تمتلك منتجات أو مذكرات لبيعها؟'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Open your store in minutes and manage orders.' : 'افتح متجرك، ارفع شعارك ومنتجاتك، وابدأ البيع لطلاب الجامعة بكل سهولة.'}
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('seller')}
            className="px-5 py-3 bg-black dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl text-xs font-bold transition shrink-0 shadow-xs hover:scale-105 cursor-pointer"
          >
            {isEn ? 'Open Store' : 'فتح متجر'}
          </button>
        </div>

        {/* كارد المشترين والطلاب */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg inline-block">
              {isEn ? 'For Student Buyers' : 'التسوق الذكي'}
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isEn ? 'Shop campus notes & projects' : 'تصفح احتياجاتك الأكاديمية والخدمية'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Explore verified peer stores and order securely.' : 'استكشف المتاجر الطلابية المعتمدة واطلب بضغطة زر واحدة مع الدفع عند الاستلام.'}
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('explore')}
            className="px-5 py-3 bg-[#1493d8] hover:bg-[#117bb5] text-white rounded-2xl text-xs font-bold transition shrink-0 shadow-xs hover:scale-105 cursor-pointer"
          >
            {isEn ? 'Explore' : 'استكشاف السوق'}
          </button>
        </div>

      </div>

      {/* عرض المتاجر المعتمدة بشكل سريع في الصفحة الرئيسية */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            {isEn ? 'Featured Campus Stores' : 'المتاجر الطلابية المعتمدة'}
          </h3>
          <button 
            onClick={() => setCurrentView('stores')}
            className="text-xs font-bold text-[#1493d8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isEn ? 'View All Stores' : 'عرض كل المتاجر'}</span>
            <ArrowRight size={14} className="rtl:-scale-x-100" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stores.length > 0 ? (
            stores.slice(0, 3).map((st) => (
              <div 
                key={st._id || st.storeName} 
                onClick={() => setCurrentView('stores')}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:border-[#1493d8] transition"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-[#1493d8] font-black shrink-0 overflow-hidden border">
                  {st.storeLogo ? (
                    <img src={st.storeLogo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Store size={22} />
                  )}
                </div>
                <div className="truncate flex-1">
                  <h4 className="font-black text-xs text-slate-900 dark:text-white truncate">{st.storeName}</h4>
                  <span className="text-[10px] text-slate-400 block truncate">{st.storeDesc || 'متجر طلابي معتمد'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              {isEn ? 'No stores registered yet.' : 'جاري تحميل المتاجر أو لا توجد متاجر نشطة حالياً.'}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}