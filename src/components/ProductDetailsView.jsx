import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Check, 
  Heart, 
  Plus, 
  Minus,
  Building
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs'; // استيراد مسار التنقل

export default function ProductDetailsView({ 
  product, 
  onAddToCart, 
  savedItems = [], 
  onToggleSave, 
  setCurrentView, 
  setSelectedStore,
  language = 'ar' 
}) {
  const isEn = language === 'en';
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4" dir={isEn ? 'ltr' : 'rtl'}>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">لم يتم اختيار أي منتج</h2>
        <button 
          onClick={() => setCurrentView('explore')}
          className="px-6 py-2.5 bg-black dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-2xl"
        >
          العودة للاستكشاف
        </button>
      </div>
    );
  }

  const pId = product._id || product.id;
  const isSaved = savedItems.some(item => (item._id || item.id) === pId);
  const hasImage = product.image && (product.image.startsWith('data:') || product.image.startsWith('http'));

  const handleAddToCartWithQty = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleStoreClick = () => {
    if (product.store && setSelectedStore) {
      setSelectedStore(product.store);
      setCurrentView('explore');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* مسار التنقل مثل أمازون وسلة */}
      <Breadcrumbs 
        language={language}
        items={[
          { label: isEn ? 'Explore' : 'التسوق والاستكشاف', onClick: () => setCurrentView('explore') },
          { label: product.title }
        ]} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* صورة المنتج */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
          {hasImage ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">🛍️</span>
          )}

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(product)}
              className="absolute top-4 left-4 p-3 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-400 hover:text-red-500 shadow-md transition"
            >
              <Heart size={20} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
            </button>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1493d8] bg-sky-50 dark:bg-sky-950/50 px-3 py-1 rounded-lg">
                {product.category || 'عام'}
              </span>

              <button 
                onClick={handleStoreClick}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#1493d8] transition bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Store size={14} />
                <span>{product.store || 'متجر طلابي'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            <div className="text-2xl font-black text-slate-950 dark:text-white">
              {product.price}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              {product.desc || 'لا يوجد وصف تفصيلي إضافي لهذا المنتج. المنتج مقدم ومضمون من قبل الطالب صاحب المتجر ضمن منصة UTAS Market.'}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">الكمية المطلوبة:</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-black text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCartWithQty}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md ${
                isAdded ? 'bg-emerald-600 text-white' : 'bg-black dark:bg-slate-100 dark:text-slate-900 text-white'
              }`}
            >
              {isAdded ? <Check size={18} /> : <ShoppingBag size={18} className="text-[#1493d8]" />}
              <span>{isAdded ? 'تمت الإضافة بنجاح إلى السلة' : 'أضف إلى سلة المشتريات'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500 font-bold">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <Building size={16} className="text-[#1493d8]" />
                <span>استلام من الحرم الجامعي</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>دفع آمن عند الاستلام</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}