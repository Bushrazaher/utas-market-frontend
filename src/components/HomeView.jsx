import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Store, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  BookOpen, 
  Utensils, 
  PenTool, 
  Layers
} from 'lucide-react';
import UtasLogo from './UtasLogo';
import { API_URL } from '../config';

export default function HomeView({ setCurrentView, onAddToCart, language = 'ar', theme = 'light' }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const isEn = language === 'en';
  const isDark = theme === 'dark';

  useEffect(() => {
   fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(-4).reverse());
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleAdd = (product) => {
    if (onAddToCart) onAddToCart(product);
    setAddedId(product._id || product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const quickCategories = [
    { title: isEn ? 'Books & Notes' : 'كتب ومذكرات', icon: <BookOpen size={18} />, cat: 'كتب ومذكرات' },
    { title: isEn ? 'Services & Design' : 'خدمات وتصاميم', icon: <PenTool size={18} />, cat: 'خدمات طلابية' },
    { title: isEn ? 'Food & Snacks' : 'سناكس ومأكولات', icon: <Utensils size={18} />, cat: 'مأكولات ومشروبات' },
    { title: isEn ? 'All Categories' : 'كل التصنيفات', icon: <Layers size={18} />, action: 'categories' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8">
      
      {/* البنر الترحيبي */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#1493d8]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3 text-center md:text-start">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/15 text-xs font-bold text-[#1493d8]">
              <ShieldCheck size={14} />
              <span>{isEn ? 'Official Verified Campus Marketplace' : 'المنصة الرسمية المعتمدة لطلاب الحرم الجامعي'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              UTAS MARKET <br />
              <span className="text-[#1493d8] text-xl sm:text-3xl font-bold">
                {isEn ? 'Empowering Student Commerce' : 'منصة التجارة الطلابية الذكية'}
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isEn 
                ? 'Trade lecture notes, order fresh bites, and explore trusted peer services easily and safely.' 
                : 'تبادل المذكرات الدراسية، اطلب المأكولات الطازجة، وتصفح خدمات زملاء الجامعة بكل سهولة وأمان.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => setCurrentView('explore')}
                className="bg-[#1493d8] hover:bg-[#0f7ebc] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
              >
                <Compass size={16} />
                <span>{isEn ? 'Explore Market' : 'استكشف المنتجات'}</span>
              </button>

              <button
                onClick={() => setCurrentView('stores')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
              >
                <Store size={16} />
                <span>{isEn ? 'Student Stores' : 'المتاجر الطلابية'}</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs flex items-center justify-center">
            <UtasLogo className="h-20 sm:h-28 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* تصنيفات سريعة */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-black">{isEn ? 'Quick Categories' : 'تصفح حسب اهتمامك'}</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isEn ? 'Handpicked categories for fast access' : 'أقسام مختارة لمساعدتك على الوصول السريع'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-[#1493d8] hover:underline flex items-center gap-1"
          >
            <span>{isEn ? 'View All' : 'عرض الكل'}</span>
            {isEn ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickCategories.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentView(item.action || 'categories')}
              className={`p-3.5 rounded-2xl border text-start flex items-center gap-3 transition ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-slate-800 text-[#1493d8]' : 'bg-sky-50 text-[#1493d8]'
              }`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold">{item.title}</h4>
                <span className="text-[10px] text-slate-400">{isEn ? 'Browse now' : 'تصفح الآن'}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* وصل حديثاً */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#1493d8]" />
            <h2 className="text-base sm:text-lg font-black">{isEn ? 'Recent Arrivals' : 'وصل حديثاً إلى السوق'}</h2>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="text-xs font-bold text-[#1493d8] hover:underline flex items-center gap-1"
          >
            <span>{isEn ? 'All Products' : 'كل المنتجات'}</span>
            {isEn ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-xs text-slate-400">{isEn ? 'Loading products...' : 'جاري تحميل المنتجات...'}</div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((p) => {
              const pid = p._id || p.id;
              const isAdded = addedId === pid;
              const hasImg = p.image && (p.image.startsWith('data:') || p.image.startsWith('http'));

              return (
                <div 
                  key={pid} 
                  className={`rounded-2xl p-3.5 border flex flex-col justify-between transition ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2 flex items-center justify-center">
                      {hasImg ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🛍️</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#1493d8] font-bold block mb-1">{p.category}</span>
                    <h4 className="font-bold text-xs line-clamp-1">{p.title}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.store}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t mt-3 border-slate-100 dark:border-slate-800">
                    <span className="font-black text-xs">{p.price}</span>
                    <button
                      onClick={() => handleAdd(p)}
                      className={`text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'
                      }`}
                    >
                      {isAdded ? <Check size={12} /> : <ShoppingBag size={12} />}
                      <span>{isAdded ? (isEn ? 'Added' : 'تمت الإضافة') : (isEn ? 'Add' : 'أضف للسلة')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-8 rounded-2xl border border-dashed text-xs ${
            isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            {isEn ? 'No products uploaded yet.' : 'لا توجد منتجات معروضة حالياً.'}
          </div>
        )}
      </section>
    </div>
  );
}