import React, { useState } from 'react';
import { X, ShoppingBag, Check, Store, ShieldCheck, Plus, Minus } from 'lucide-react';

export default function QuickViewModal({ 
  product, 
  onClose, 
  onAddToCart, 
  language = 'ar' 
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const isEn = language === 'en';

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const hasImage = product.image && (product.image.startsWith('data:') || product.image.startsWith('http'));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in" dir={isEn ? 'ltr' : 'rtl'}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* صورة المنتج */}
          <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            {hasImage ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">🛍️</span>
            )}
            <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-lg">
              {product.category || 'عام'}
            </span>
          </div>

          {/* معلومات المنتج والتحكم */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Store size={14} className="text-[#1493d8]" />
                <span>{product.store || 'متجر طلابي'}</span>
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                {product.title}
              </h2>

              <div className="text-xl font-black text-slate-950 dark:text-white">
                {product.price}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {product.desc || 'منتج طلابي معتمد ومضمون داخل الحرم الجامعي ضمن منصة UTAS Market.'}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* اختيار الكمية */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">الكمية:</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* زر الإضافة السريعة */}
              <button
                onClick={handleAdd}
                className={`w-full py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md ${
                  isAdded ? 'bg-emerald-600 text-white' : 'bg-black dark:bg-slate-100 dark:text-slate-900 text-white'
                }`}
              >
                {isAdded ? <Check size={16} /> : <ShoppingBag size={16} className="text-[#1493d8]" />}
                <span>{isAdded ? 'تمت الإضافة للسلة' : 'أضف للسلة فوراً'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}