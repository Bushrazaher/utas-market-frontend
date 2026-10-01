import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ArrowRight, 
  ShoppingBag, 
  Heart, 
  Check, 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { API_URL } from '../config';

export default function StoreDetailsView({ 
  store, 
  onAddToCart, 
  savedItems = [], 
  onToggleSave, 
  setCurrentView, 
  onSelectProduct,
  onBack, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';
  
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (!store) return;
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        // تصفية المنتجات الخاصة بهذا المتجر حصرياً بناءً على اسم المتجر أو بريد التاجر
        const filtered = data.filter(p => 
          (store.storeName && p.store && p.store.toLowerCase() === store.storeName.toLowerCase()) ||
          (store.email && p.sellerEmail && p.sellerEmail.toLowerCase() === store.email.toLowerCase())
        );
        setStoreProducts(filtered.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [store]);

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4" dir={isEn ? 'ltr' : 'rtl'}>
        <h2 className="text-xl font-black text-slate-800">لم يتم اختيار أي متجر</h2>
        <button 
          onClick={() => setCurrentView('stores')}
          className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-2xl"
        >
          العودة لقائمة المتاجر
        </button>
      </div>
    );
  }

  const handleAdd = (product, e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    const pId = product._id || product.id;
    setAddedId(pId);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSave = (product, e) => {
    e.stopPropagation();
    if (onToggleSave) onToggleSave(product);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* زر الرجوع */}
      <button 
        onClick={onBack || (() => setCurrentView('stores'))}
        className="flex items-center gap-2 text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white font-bold text-xs bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition w-fit"
      >
        <ArrowRight size={16} className={isEn ? 'rotate-180' : ''} />
        <span>{isEn ? 'Back to Stores' : 'الرجوع للمتاجر'}</span>
      </button>

      {/* بنر التعريف بالمتجر */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="h-40 bg-gradient-to-r from-slate-900 via-[#1493d8] to-slate-900 relative">
          {store.storeBanner && (
            <img src={store.storeBanner} alt="" className="w-full h-full object-cover opacity-60" />
          )}
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-12">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center shrink-0">
              {store.storeLogo ? (
                <img src={store.storeLogo} alt={store.storeName} className="w-full h-full object-cover" />
              ) : (
                <Store size={36} className="text-[#1493d8]" />
              )}
            </div>

            <div className="space-y-1 mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{store.storeName}</h1>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/20">
                  <ShieldCheck size={12} />
                  <span>معتمد</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{store.storeDesc || 'متجر طلابي معتمد في منصة UTAS Market'}</p>
            </div>
          </div>

          {/* روابط التواصل المباشر مع التاجر */}
          <div className="flex items-center gap-2">
            {store.whatsapp && (
              <a 
                href={`https://wa.me/${store.whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs"
              >
                <Phone size={14} />
                <span>مراسلة واتساب</span>
              </a>
            )}
            {store.instagram && (
              <a 
                href={`https://instagram.com/${store.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs"
              >
                <ExternalLink size={14} />
                <span>إنستغرام</span>
              </a>
            )}
          </div>
        </div>

        {/* تفاصيل إضافية عن أوقات العمل ومكان الاستلام */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#1493d8]" />
            <span>ساعات العمل: {store.workingHours || 'من الأحد إلى الخميس (8 صباحاً - 4 مساءً)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#1493d8]" />
            <span>مكان الاستلام: {store.location || 'الحرم الجامعي - الكلية التقنية'}</span>
          </div>
        </div>
      </div>

      {/* معروضات المتجر */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">منتجات ومعروضات المتجر</h2>
          <span className="text-xs font-bold text-slate-400">{storeProducts.length} منتج متوفر</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-xs font-bold">جاري تحميل معروضات المتجر...</div>
        ) : storeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeProducts.map((product) => {
              const pId = product._id || product.id;
              const isAdded = addedId === pId;
              const isSaved = savedItems.some((item) => (item._id || item.id) === pId);
              const hasImage = product.image && (product.image.startsWith('data:') || product.image.startsWith('http'));

              return (
                <div 
                  key={pId} 
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className="tactile-card bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                      {hasImage ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-4xl">🛍️</span>
                      )}

                      {onToggleSave && (
                        <button
                          onClick={(e) => handleSave(product, e)}
                          className="tactile-btn absolute top-2.5 left-2.5 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-400 hover:text-red-500 shadow-xs transition"
                          title="حفظ في المفضلة"
                        >
                          <Heart size={15} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                        </button>
                      )}

                      <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                        {product.tag || 'متوفر'}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-[#1493d8] bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                      {product.category}
                    </span>

                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1 line-clamp-1 leading-snug group-hover:text-[#1493d8] transition">
                      {product.title}
                    </h3>

                    {product.desc && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {product.desc}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700 mt-2">
                    <button
                      onClick={(e) => handleAdd(product, e)}
                      className={`tactile-btn text-xs font-black py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 shadow-xs ${
                        isAdded ? 'bg-emerald-600 text-white' : 'bg-black dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-900 text-white'
                      }`}
                    >
                      {isAdded ? <Check size={14} /> : <ShoppingBag size={14} className="text-[#1493d8]" />}
                      <span>{isAdded ? 'تمت الإضافة' : 'أضف للسلة'}</span>
                    </button>

                    <span className="font-black text-slate-950 dark:text-white text-sm tracking-wide">
                      {product.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs font-bold">
            لا توجد منتجات مسجلة لهذا المتجر حتى الآن.
          </div>
        )}
      </div>

    </div>
  );
}