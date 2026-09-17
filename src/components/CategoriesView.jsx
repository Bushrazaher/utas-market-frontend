import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PenTool, 
  Utensils, 
  Laptop, 
  Shirt, 
  Layers, 
  ShoppingBag, 
  Check, 
  ArrowLeft 
} from 'lucide-react';
import { API_URL } from '../config';

export default function CategoriesView({ setCurrentView, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('جميع الأقسام');
  const [addedId, setAddedId] = useState(null);

  const categoriesList = [
    { name: 'جميع الأقسام', icon: <Layers size={20} />, count: products.length },
    { name: 'خدمات طلابية', icon: <PenTool size={20} />, count: products.filter(p => p.category === 'خدمات طلابية').length },
    { name: 'كتب ومذكرات', icon: <BookOpen size={20} />, count: products.filter(p => p.category === 'كتب ومذكرات').length },
    { name: 'مأكولات ومشروبات', icon: <Utensils size={20} />, count: products.filter(p => p.category === 'مأكولات ومشروبات').length },
    { name: 'إلكترونيات وأدوات', icon: <Laptop size={20} />, count: products.filter(p => p.category === 'إلكترونيات وأدوات').length },
    { name: 'أزياء وإكسسوارات', icon: <Shirt size={20} />, count: products.filter(p => p.category === 'أزياء وإكسسوارات').length },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data.reverse()))
      .catch(() => {});
  }, []);

  const handleAdd = (product) => {
    if (onAddToCart) onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const displayedProducts = activeCategory === 'جميع الأقسام'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir="rtl">
      
      {/* بنر الصفحة الموحد */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 md:p-14 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#1493d8]">
            <Layers size={14} />
            <span>دليل الأقسام الجامعية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            تصنيفات السوق <br />
            <span className="text-[#1493d8]">في UTAS Market</span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed pt-1">
            اختر التخصص أو نوع الخدمة للوصول مباشرة إلى المعروضات والخدمات المتاحة داخل الكليات.
          </p>
        </div>
      </section>

      {/* بطاقات الأقسام العريضة */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categoriesList.map((cat, idx) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat.name)}
              className={`tactile-card p-4 rounded-2xl border text-right transition flex flex-col justify-between min-h-[110px] ${
                isActive
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-slate-800 border-slate-200/90 hover:border-[#1493d8]'
              }`}
            >
              <div className={`p-2 rounded-xl w-fit ${isActive ? 'bg-white/10 text-[#1493d8]' : 'bg-slate-50 text-slate-600'}`}>
                {cat.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm leading-snug">{cat.name}</h4>
                <span className={`text-[10px] font-medium block mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {cat.count} منتجات
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* منتجات القسم المختار */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
          <h3 className="text-base font-black text-slate-900">
            معروضات قسم: <span className="text-[#1493d8]">{activeCategory}</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">{displayedProducts.length} معروض</span>
        </div>

        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((p) => {
              const isAdded = addedId === p.id;
              const hasImage = p.image && (p.image.startsWith('data:') || p.image.startsWith('http'));

              return (
                <div key={p.id} className="tactile-card bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 flex items-center justify-center">
                      {hasImage ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">🛍️</span>
                      )}
                      <span className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg">
                        {p.tag || 'جديد'}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 mb-1 truncate">{p.store}</div>
                    <h4 className="font-black text-slate-900 text-sm mb-2">{p.title}</h4>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleAdd(p)}
                      className={`tactile-btn text-xs font-black py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
                        isAdded ? 'bg-emerald-600 text-white' : 'bg-black hover:bg-slate-900 text-white'
                      }`}
                    >
                      {isAdded ? <Check size={14} /> : <ShoppingBag size={14} className="text-[#1493d8]" />}
                      <span>{isAdded ? 'تمت الإضافة' : 'أضف للسلة'}</span>
                    </button>
                    <span className="font-black text-slate-950 text-sm">{p.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 text-xs font-bold text-slate-400">
            لا توجد منتجات مسجلة في هذا القسم حتى الآن.
          </div>
        )}
      </div>

    </div>
  );
}