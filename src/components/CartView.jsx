import React, { useState } from 'react';
import { Trash2, ArrowRight, Tag, Check, ShoppingBag } from 'lucide-react';

export default function CartView({ cartItems, setCartItems, currentUser, setCurrentView, onBack }) {
  // تفعيل حالات كود الخصم التي أضفناها مسبقاً
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'UTAS10' || code === 'STUDENT') {
      setDiscount(0.500);
      setIsCouponApplied(true);
      setCouponMessage('تم تطبيق كود الخصم بنجاح (-0.500 OMR)');
    } else {
      setDiscount(0);
      setIsCouponApplied(false);
      setCouponMessage('كود الخصم غير صحيح أو منتهي الصلاحية.');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
  const platformFee = (subtotal * 0.05).toFixed(3);
  const finalTotal = (subtotal + parseFloat(platformFee) - discount).toFixed(3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="text-[#1493d8]" />
          <span>سلة المشتريات</span>
        </h2>
        {onBack && (
          <button onClick={onBack} className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">
            ← رجوع
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400">سلة المشتريات فارغة حالياً.</p>
          <button
            onClick={() => setCurrentView('explore')}
            className="px-6 py-3 bg-[#1493d8] text-white rounded-2xl text-xs font-bold shadow-md hover:opacity-90 transition"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* قائمة المنتجات */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id || item.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">{item.title}</h4>
                    <span className="text-[11px] text-[#1493d8] font-bold">{item.price} OMR</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">الكمية: {item.quantity || 1}</span>
                  <button
                    onClick={() => setCartItems(prev => prev.filter(i => (i._id || i.id) !== (item._id || item.id)))}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="حذف المنتج"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ملخص السلة وقسيمة الخصم */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white">ملخص الطلب</h3>
              
              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-slate-900 dark:text-white">{subtotal.toFixed(3)} OMR</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم المنصة (5%)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{platformFee} OMR</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>قسيمة التخفيض</span>
                    <span>-{discount.toFixed(3)} OMR</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white">
                  <span>الإجمالي النهائي</span>
                  <span className="text-[#1493d8]">{finalTotal} OMR</span>
                </div>
              </div>

              {/* خانة كود الخصم التفاعلية */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Tag size={14} className="text-[#1493d8]" />
                  <span>كود الخصم (جرب UTAS10)</span>
                </div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="أدخل الكود"
                    disabled={isCouponApplied}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8]"
                  />
                  <button
                    type="submit"
                    disabled={isCouponApplied || !couponCode.trim()}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isCouponApplied ? 'bg-emerald-600 text-white' : 'bg-black dark:bg-slate-100 dark:text-slate-900 text-white'
                    }`}
                  >
                    {isCouponApplied ? 'مفعل ✓' : 'تطبيق'}
                  </button>
                </form>
                {couponMessage && (
                  <p className={`text-[11px] font-bold ${isCouponApplied ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              <button
                onClick={() => alert('تم إرسال الطلب بنجاح! سيتم التواصل معك عبر واتساب.')}
                className="w-full py-3.5 bg-[#1493d8] hover:bg-[#117bb5] text-white rounded-2xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                إتمام الطلب الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}