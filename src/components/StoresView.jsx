import React, { useState, useEffect } from 'react';
import { Store, CheckCircle2, Package, ArrowRight, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import { API_URL } from '../config';

export default function StoresView({ 
  stores: initialStores = [], 
  setCurrentView, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  const [storesList, setStoresList] = useState(initialStores);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب المتاجر المعتمدة والمنتجات من قاعدة البيانات
  const fetchLiveStores = async () => {
    setLoading(true);
    try {
      const [storesRes, prodsRes] = await Promise.all([
        fetch(`${API_URL}/api/stores`),
        fetch(`${API_URL}/api/products`)
      ]);

      if (storesRes.ok) {
        const storesData = await storesRes.json();
        setStoresList(storesData);
      }

      if (prodsRes.ok) {
        const prodsData = await prodsRes.json();
        setProducts(prodsData);
      }
    } catch (err) {
      console.error('تعذر جلب بيانات المتاجر:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStores();
  }, []);

  // احتساب عدد منتجات كل متجر من قاعدة البيانات الحقيقية
  const getProductCount = (storeName) => {
    if (!storeName) return 0;
    return products.filter(
      (p) => p.store?.trim().toLowerCase() === storeName.trim().toLowerCase()
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* ترويسة الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black">
            {isEn ? 'Verified Student Stores' : 'المتاجر الطلابية المعتمدة'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isEn 
              ? 'Browse certified student businesses and creative university ventures' 
              : 'تصفح متاجر الطلاب المعتمدة وادعم المشاريع والمبادرات الجامعية'}
          </p>
        </div>

        <button
          onClick={fetchLiveStores}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{isEn ? 'Refresh' : 'تحديث القائمة'}</span>
        </button>
      </div>

      {/* شبكة عرض المتاجر المعتمدة الحقيقية */}
      {loading ? (
        <div className="text-center py-20 text-xs font-bold text-slate-400">
          {isEn ? 'Loading verified stores...' : 'جاري تحميل المتاجر المعتمدة...'}
        </div>
      ) : storesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {storesList.map((st) => {
            const count = getProductCount(st.storeName);
            return (
              <div
                key={st._id || st.email}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-sky-200'
                }`}
              >
                <div className="space-y-3">
                  {/* رأس بطاقة المتجر */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-[#1493d8] flex items-center justify-center shrink-0">
                        <Store size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {st.storeName}
                          </h3>
                          <CheckCircle2 size={15} className="text-[#1493d8]" />
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {st.name} {st.storePhone ? `(${st.storePhone})` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-black text-xs">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>5.0</span>
                    </div>
                  </div>

                  {/* وصف نشاط المتجر */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {st.storeDesc || (isEn ? 'Student academic projects and campus services.' : 'مشاريع وخدمات أكاديمية طلابية متخصصة.')}
                  </p>
                </div>

                {/* أسفل البطاقة وزر التصفح */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Package size={15} className="text-[#1493d8]" />
                    <span>{count} {isEn ? 'Products' : 'منتج معروض'}</span>
                  </div>

                  <button
                    onClick={() => setCurrentView('explore')}
                    className="tactile-btn px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <span>{isEn ? 'Visit Store' : 'زيارة المتجر'}</span>
                    <ArrowIcon size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-20 rounded-3xl border border-dashed text-xs font-bold text-slate-400 ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'
        }`}>
          {isEn ? 'No approved stores found yet.' : 'لا توجد متاجر معتمدة حالياً. سيظهر متجرك فور اعتماده من الإشراف.'}
        </div>
      )}

    </div>
  );
}