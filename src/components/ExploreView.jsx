import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { API_URL } from '../config';
export default function ExploreView({ 
  setCurrentView, 
  onAddToCart, 
  searchQuery = '', 
  savedItems = [], 
  onToggleSave 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [addedId, setAddedId] = useState(null);

  const categories = [
    'الكل',
    'خدمات طلابية',
    'كتب ومذكرات',
    'مأكولات ومشروبات',
    'إلكترونيات وأدوات',
    'أزياء وإكسسوارات'
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleAdd = (product) => {
    if (onAddToCart) onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesSearch = !localSearch.trim() || 
      p.title?.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.store?.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.desc?.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir="rtl">
      
      {/* بنر العنوان الصافي تماماً مثل الصورة */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 md:p-14 border border-slate-900 shadow-2xl">
        
        {/* إضاءة أزرق هادئة في الزاوية */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          
        

          <h6 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            اكتشف ما يناسبك <br />
            <span className="text-[#1493d8]">في UTAS Market</span>
          </h6>


        </div>
      </section>

      {/* البحث والتصنيفات */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="ابحث بالاسم، المادة، أو المتجر..."
              className="w-full bg-white border border-slate-200 shadow-xs rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#1493d8] transition"
            />
            <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="text-xs font-bold text-slate-500 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
            المعروض: <span className="text-slate-900 font-black">{filteredProducts.length}</span> منتج
          </div>
        </div>

        {/* أزرار التصنيفات */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition shadow-xs ${
                  active
                    ? 'bg-black text-white ring-2 ring-black'
                    : 'bg-white text-slate-700 hover:text-black border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* شبكة المنتجات */}
      {loading ? (
        <div className="text-center py-24 text-slate-400 text-xs font-bold">
          جاري تحميل المنتجات...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = addedId === product.id;
            const isSaved = savedItems.some((item) => item.id === product.id);
            const hasImage = product.image && (product.image.startsWith('data:') || product.image.startsWith('http'));

            return (
              <div 
                key={product.id} 
                className="tactile-card bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 flex items-center justify-center border border-slate-100">
                    {hasImage ? (
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl">🛍️</span>
                    )}

                    {onToggleSave && (
                      <button
                        onClick={() => onToggleSave(product)}
                        className="tactile-btn absolute top-2.5 left-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 shadow-xs transition"
                        title="حفظ في المفضلة"
                      >
                        <Heart size={15} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    )}

                    <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                      {product.tag || 'جديد'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] mb-1.5 font-bold">
                    <span className="text-[#1493d8] bg-sky-50 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    <span className="text-slate-500 truncate max-w-[110px]">
                      {product.store}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm mb-1 line-clamp-1 leading-snug">
                    {product.title}
                  </h3>

                  {product.desc && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {product.desc}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => handleAdd(product)}
                    className={`tactile-btn text-xs font-black py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 shadow-xs ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black hover:bg-slate-900 text-white'
                    }`}
                  >
                    {isAdded ? <Check size={14} /> : <ShoppingBag size={14} className="text-[#1493d8]" />}
                    <span>{isAdded ? 'تمت الإضافة' : 'أضف للسلة'}</span>
                  </button>

                  <span className="font-black text-slate-950 text-sm tracking-wide">
                    {product.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500 text-xs font-bold space-y-2">
          <p>لا توجد منتجات مطابقة في هذا التصنيف حالياً.</p>
          <button
            onClick={() => { setSelectedCategory('الكل'); setLocalSearch(''); }}
            className="text-[#1493d8] underline hover:text-black transition"
          >
            إعادة تعيين التصفية
          </button>
        </div>
      )}

    </div>
  );
}