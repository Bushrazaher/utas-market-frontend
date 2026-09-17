import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Check, 
  Compass,
  Store
} from 'lucide-react';

export default function SavedItemsView({ 
  savedItems = [], 
  onRemoveSaved, 
  onAddToCart, 
  setCurrentView 
}) {
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (product) => {
    if (onAddToCart) onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir="rtl">
      
      {/* بنر العنوان المطابق لثيم المنصة الصافي */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 md:p-14 border border-slate-900 shadow-2xl">
        
        {/* إضاءة زرقاء هادئة في الخلفية */}
        <div className="absolute top-0 right-1/4 w-80 h-50 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          
          

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            قائمتك المفضلة <br />
            <span className="text-[#1493d8]">في UTAS Market</span>
          </h1>

          

        </div>
      </section>

      {/* شريط الإحصائية والتحكم */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
        <div className="text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
          العناصر المحفوظة: <span className="text-slate-900 font-black">{savedItems.length}</span> منتجات
        </div>

        <button
          onClick={() => setCurrentView('explore')}
          className="tactile-btn text-xs font-bold text-slate-600 hover:text-black bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl transition flex items-center gap-1.5 shadow-xs"
        >
          <span>استكشاف المزيد</span>
          <ArrowRight size={14} className="rtl:-scale-x-100" />
        </button>
      </div>

      {/* شبكة العناصر المفضلة */}
      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedItems.map((product) => {
            const isAdded = addedId === product.id;
            const hasImage = product.image && (product.image.startsWith('data:') || product.image.startsWith('http'));

            return (
              <div 
                key={product.id} 
                className="tactile-card bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
              >
                <div>
                  {/* حاوية الصورة */}
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

                    {/* زر الحذف السريع من المفضلة */}
                    <button
                      onClick={() => onRemoveSaved && onRemoveSaved(product.id)}
                      className="tactile-btn absolute top-2.5 left-2.5 p-2 rounded-full bg-white/95 backdrop-blur-md text-red-500 hover:bg-red-50 shadow-xs transition"
                      title="إزالة من المفضلة"
                    >
                      <Trash2 size={14} />
                    </button>

                    <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                      {product.category || 'عام'}
                    </span>
                  </div>

                  {/* بيانات المتجر والعنوان */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1">
                    <Store size={12} className="text-[#1493d8]" />
                    <span className="truncate">{product.store || 'متجر طلابي'}</span>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm mb-2 line-clamp-1 leading-snug">
                    {product.title}
                  </h3>
                </div>

                {/* السعر وزر الإضافة إلى السلة */}
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
        /* في حال كانت المفضلة فارغة */
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
            <Heart size={30} />
          </div>
          <h3 className="text-base font-bold text-slate-800">قائمة المفضلة فارغة حالياً</h3>
         
          <button
            onClick={() => setCurrentView('explore')}
            className="tactile-btn bg-black hover:bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-xs inline-flex items-center gap-2"
          >
            <Compass size={15} className="text-[#1493d8]" />
            <span>استكشف المنتجات الآن</span>
          </button>
        </div>
      )}

    </div>
  );
}