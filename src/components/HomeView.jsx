import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Store, 
  Compass, 
  BookOpen, 
  Code, 
  Coffee, 
  Layers, 
  ShieldCheck,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import UtasLogo from './UtasLogo';

export default function HomeView({ 
  stores = [], 
  setCurrentView, 
  searchQuery, 
  setSearchQuery, 
  onAddToCart, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  const quickCategories = [
    { id: 'notes', name: isEn ? 'Books & Notes' : 'مذكرات وكتب', sub: isEn ? 'Browse now' : 'تصفح الآن', icon: <BookOpen size={20} className="text-sky-500" /> },
    { id: 'projects', name: isEn ? 'Services & Design' : 'مشاريع وخدمات', sub: isEn ? 'Browse now' : 'تصفح الآن', icon: <Code size={20} className="text-indigo-500" /> },
    { id: 'food', name: isEn ? 'Food & Snacks' : 'مأكولات وحلويات', sub: isEn ? 'Order fresh' : 'طازجة يومياً', icon: <Coffee size={20} className="text-amber-500" /> },
    { id: 'all', name: isEn ? 'All Categories' : 'جميع الأقسام', sub: isEn ? 'Explore all' : 'استكشف الكل', icon: <Layers size={20} className="text-emerald-500" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* 1. البنر الإعلاني المطور المتجاوب */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-slate-800 text-white' 
          : 'bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#0b132b] text-white border-slate-800 shadow-xl'
      }`}>
        
        {/* توهج خلفي تجميلي */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          
          {/* النصوص الترويجية */}
          <div className="space-y-4 max-w-xl text-center md:text-start">
            
            {/* وسم التحقق */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-sky-300">
              <ShieldCheck size={14} />
              <span>{isEn ? 'Official Verified Campus Marketplace' : 'المنصة الرسمية المعتمدة لطلاب الحرم الجامعي'}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                UTAS MARKET
              </h1>
              <p className="text-base sm:text-xl font-bold text-[#1493d8]">
                {isEn ? 'Empowering Student Commerce' : 'منصة التجارة الطلابية الذكية'}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              {isEn 
                ? 'Trade lecture notes, order fresh bites, and explore trusted peer services easily and safely.' 
                : 'تبادل المذكرات الدراسية، اطلب المأكولات الطازجة، وتصفح خدمات زملاء الجامعة بكل سهولة وأمان.'}
            </p>

            {/* أزرار التوجيه السريع */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => setCurrentView('explore')}
                className="px-5 py-2.5 rounded-2xl bg-[#1493d8] hover:bg-[#117bb5] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg active:scale-95"
              >
                <Compass size={16} />
                <span>{isEn ? 'Explore Market' : 'استكشف المنتجات'}</span>
              </button>

              <button
                onClick={() => setCurrentView('stores')}
                className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2 backdrop-blur-xs active:scale-95"
              >
                <Store size={16} />
                <span>{isEn ? 'Student Stores' : 'المتاجر الطلابية'}</span>
              </button>
            </div>

            {/* إحصائيات سريعة تظهر في الحاسوب لإعطاء ثقل ومصداقية */}
            <div className="hidden sm:flex items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{isEn ? 'Verified Students Only' : 'تجار معتمدون من الجامعة'}</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold">
                <TrendingUp size={14} className="text-sky-400" />
                <span>{isEn ? '5% Student Support Fee' : 'عمولة رمزية 5% لدعم الأنشطة'}</span>
              </span>
            </div>
          </div>

          {/* شعار UTAS المدمج الزجاجي (مخفي في الهاتف لتوفير المساحة) */}
       {/* شعار UTAS المفرغ النقي */}
<div className="hidden md:flex flex-col items-center justify-center p-8    shadow-3xl shrink-0">
  <div className="p-2 mb-1 flex items-center justify-center">
    <UtasLogo className="h-30 w-auto" />
  </div>
</div>
        </div>
      </div>

      {/* 2. شبكة الأقسام السريعة */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black">{isEn ? 'Quick Categories' : 'تصفح حسب اهتمامك'}</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">{isEn ? 'Handpicked categories for fast access' : 'أقسام مختارة لمساعدتك على الوصول السريع'}</p>
          </div>

          <button 
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-[#1493d8] hover:underline flex items-center gap-1"
          >
            <span>{isEn ? 'View All' : 'عرض الكل'}</span>
            <ArrowIcon size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCurrentView('categories')}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:border-sky-200 shadow-2xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit mb-3">
                {cat.icon}
              </div>
              <h3 className="text-xs font-black line-clamp-1">{cat.name}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{cat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. المتاجر المعتمدة حديثاً */}
      {stores.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black">{isEn ? 'Featured Student Stores' : 'أحدث المتاجر الطلابية'}</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">{isEn ? 'Support your fellow campus merchants' : 'ادعم مشاريع زملائك في الحرم الجامعي'}</p>
            </div>
            <button 
              onClick={() => setCurrentView('stores')}
              className="text-xs font-bold text-[#1493d8] hover:underline flex items-center gap-1"
            >
              <span>{isEn ? 'All Stores' : 'كل المتاجر'}</span>
              <ArrowIcon size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stores.slice(0, 3).map((st) => (
              <div 
                key={st._id || st.email} 
                onClick={() => setCurrentView('stores')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition hover:border-[#1493d8] ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1493d8]/10 text-[#1493d8] flex items-center justify-center font-bold">
                    <Store size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black">{st.storeName}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{st.storeDesc || (isEn ? 'Student Project' : 'مشروع طلابي')}</p>
                  </div>
                </div>
                <ArrowIcon size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}