import React, { useState, useEffect } from 'react';
import { Store, Search, ArrowRight, ArrowLeft, CheckCircle2, Phone, ArrowUpRight } from 'lucide-react';
import { API_URL } from '../config';

export default function StoresView({ 
  setCurrentView, 
  onSelectStore, 
  onBack, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';
  const BackIcon = isEn ? ArrowLeft : ArrowRight;

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // جلب المتاجر مع اللوجو المحدث
  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stores`);
      if (res.ok) {
        const data = await res.json();
        setStores(data);
      }
    } catch (err) {
      console.error('فشل جلب المتاجر:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(st => 
    !search.trim() || 
    st.storeName?.toLowerCase().includes(search.toLowerCase()) ||
    st.storeDesc?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenStoreProducts = (store) => {
    if (onSelectStore) {
      onSelectStore(store);
    } else {
      setCurrentView('explore');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-3 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* سهم الرجوع للرئيسية */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || (() => setCurrentView('home'))}
          className="tactile-btn flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
        >
          <BackIcon size={14} />
          <span>{isEn ? 'Back to Home' : 'الرجوع للرئيسية'}</span>
        </button>

        <span className="text-xs font-bold text-slate-400">
          {isEn ? 'Certified Campus Stores' : 'المتاجر الطلابية المعتمدة بالحرم الجامعي'}
        </span>
      </div>

      {/* بنر المتاجر */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2 text-right">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            متاجر طلاب <span className="text-[#1493d8]">UTAS Market</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEn 
              ? 'Browse verified student projects and order directly.'
              : 'تصفح مشاريع ومتاجر زملائك المعتمدة واطلب منتجاتهم ومذكراتهم مباشرة'}
          </p>
        </div>
      </section>

      {/* شريط البحث في المتاجر */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isEn ? "Search store name or description..." : "ابحث عن اسم متجر، مذكرات، حلويات..."}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#1493d8] transition"
          />
          <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {isEn ? 'Stores:' : 'المتاجر المعتمدة:'} <span className="text-slate-900 dark:text-white font-black">{filteredStores.length}</span>
        </div>
      </div>

      {/* شبكة بطاقات المتاجر مع اللوجو وزر تصفح المنتجات المترابط */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-bold">
          {isEn ? 'Loading stores...' : 'جاري تحميل المتاجر الطلابية...'}
        </div>
      ) : filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStores.map((st) => (
            <div 
              key={st._id} 
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* عرض لوجو المتجر المحدث أو أيقونة افتراضية */}
                  <div className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 bg-sky-50 dark:bg-sky-950/40 text-[#1493d8] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {st.storeLogo ? (
                      <img 
                        src={st.storeLogo} 
                        alt={st.storeName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Store size={26} />
                    )}
                  </div>

                  <div className="truncate flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm truncate">{st.storeName}</h3>
                      <span className="text-emerald-500 shrink-0" title={isEn ? "Verified Store" : "متجر معتمد"}>
                        <CheckCircle2 size={13} />
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">{st.email}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                  {st.storeDesc || (isEn ? 'A verified student store inside the campus.' : 'متجر طلابي معتمد يقدم خدمات ومنتجات أكاديمية داخل الحرم الجامعي.')}
                </p>

                {st.storePhone && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <Phone size={12} className="text-[#1493d8]" />
                    <span dir="ltr">{st.storePhone}</span>
                  </div>
                )}
              </div>

              {/* زر الانتقال الفوري لمنتجات هذا المتجر على حدة */}
              <button
                onClick={() => handleOpenStoreProducts(st)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#1493d8] dark:bg-slate-800 dark:hover:bg-[#1493d8] text-slate-700 dark:text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 text-xs font-bold shadow-2xs"
              >
                <span>{isEn ? 'Browse Products' : 'تصفح معروضات المتجر'}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-400 space-y-2">
          <p>{isEn ? 'No stores match your search.' : 'لم يتم العثور على أي متجر يطابق بحثك.'}</p>
          <button onClick={() => setSearch('')} className="text-[#1493d8] underline font-bold">
            {isEn ? 'Clear Search' : 'إلغاء البحث'}
          </button>
        </div>
      )}

    </div>
  );
}
