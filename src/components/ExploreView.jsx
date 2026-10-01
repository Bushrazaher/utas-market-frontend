import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Check, 
  Store,
  X
} from 'lucide-react';
import { API_URL } from '../config';

export default function ExploreView({ 
  setCurrentView, 
  onAddToCart, 
  searchQuery = '', 
  savedItems = [], 
  onToggleSave,
  onSelectProduct,     
  selectedStore,      
  setSelectedStore,    
  language = 'ar',
  theme = 'light'
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
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
    Promise.all([
      fetch(`${API_URL}/api/products`).then((res) => res.json()),
      fetch(`${API_URL}/api/stores`).then((res) => res.json())
    ])
      .then(([prodsData, storesData]) => {
        setProducts(prodsData.reverse());
        setStores(storesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const getStoreLogo = (storeName) => {
    if (!storeName) return null;
    const store = stores.find(s => s.storeName && s.storeName.trim().toLowerCase() === storeName.trim().toLowerCase());
    return store?.storeLogo || null;
  };

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

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    const matchesStore = !selectedStore || (p.store && p.store.toLowerCase() === selectedStore.toLowerCase());
    const matchesSearch = !localSearch.trim() || 
      p.title?.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.store?.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.desc?.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCat && matchesStore && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir={isEn ? 'ltr' : 'rtl'}>
      
      {selectedStore && (
        <div className="flex items-center justify-between bg-sky-50 border border-[#1493d8]/30 px-4 py-3 rounded-2xl mb-4">
          <div className="flex items-center gap-2 text-[#1493d8] font-bold text-sm">
            <Store size={18} />
            <span>{isEn ? `Store Products: ${selectedStore}` : `عرض منتجات المتجر: ${selectedStore}`}</span>
          </div>
          <button 
            onClick={() => setSelectedStore && setSelectedStore(null)}
            className="text-slate-500 hover:text-red-500 flex items-center gap-1 text-xs font-bold transition"
          >
            <span>{isEn ? 'Clear Filter' : 'إلغاء الفرز'}</span>
            <X size={16} />
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 md:p-14 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {isEn ? 'Discover what suits you at ' : 'اكتشف ما يناسبك '}
            <span className="text-[#1493d8]">UTAS Market</span>
          </h1>
        </div>
      </section>

      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={isEn ? "Search by title, subject, or store..." : "ابحث بالاسم، المادة، أو المتجر..."}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#1493d8] transition"
            />
            <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 dark:text-slate-300 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto">
            {isEn ? 'Results:' : 'المعروض:'} <span className="text-slate-900 dark:text-white font-black">{filteredProducts.length}</span> {isEn ? 'items' : 'منتج'}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition shadow-xs ${
                  active
                    ? 'bg-black dark:bg-slate-100 dark:text-slate-900 text-white ring-2 ring-black'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-black border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 text-xs font-bold">
          {isEn ? 'Loading products...' : 'جاري تحميل المنتجات...'}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const pId = product._id || product.id;
            const isAdded = addedId === pId;
            const isSaved = savedItems.some((item) => (item._id || item.id) === pId);
            const hasImage = product.image && (product.image.startsWith('data:') || product.image.startsWith('http'));
            const logo = getStoreLogo(product.store);

            return (
              <div 
                key={pId} 
                onClick={() => onSelectProduct && onSelectProduct(product)}
                className="tactile-card bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative cursor-pointer"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3 flex items-center justify-center border border-slate-100 dark:border-slate-700">
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
                        onClick={(e) => handleSave(product, e)}
                        className="tactile-btn absolute top-2.5 left-2.5 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-400 hover:text-red-500 shadow-xs transition"
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
                    <span className="text-[#1493d8] bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (setSelectedStore) setSelectedStore(product.store);
                      }}
                      className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#1493d8] transition max-w-[110px] truncate"
                      title="عرض منتجات هذا المتجر فقط"
                    >
                      {logo && <img src={logo} alt="" className="w-4 h-4 rounded-full object-cover shrink-0 border border-slate-200" />}
                      <span className="truncate">{product.store}</span>
                    </button>
                  </div>

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
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs font-bold space-y-2">
          <p>{isEn ? 'No products match this filter.' : 'لا توجد منتجات مطابقة لهذا الفرز.'}</p>
          <button
            onClick={() => { setSelectedCategory('الكل'); setSelectedStore && setSelectedStore(null); setLocalSearch(''); }}
            className="text-[#1493d8] underline hover:text-black dark:hover:text-white transition"
          >
            {isEn ? 'Clear filter and show all' : 'إلغاء الفرز وعرض الكل'}
          </button>
        </div>
      )}
    </div>
  );
}