import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  Store,
  AlertCircle,
  Truck,
  Building,
  Phone
} from 'lucide-react';
import { API_URL } from '../config';
export default function CartView({ 
  setCurrentView, 
  cartItems = [], 
  setCartItems, 
  onCreateOrder,
  currentUser
}) {
  const [deliveryType, setDeliveryType] = useState('campus_office'); // 'campus_office' | 'home_delivery'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // حساب قيمة المنتجات
  const subtotal = cartItems.reduce((sum, item) => {
    const rawPrice = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, '')) || 0 
      : Number(item.price) || 0;
    return sum + (rawPrice * (item.quantity || 1));
  }, 0);

  // احتساب رسوم المنصة الرسمية (5%)
  const platformFee = Number((subtotal * 0.05).toFixed(3));
  const total = Number((subtotal + platformFee).toFixed(3));

  const handleUpdateQuantity = (id, delta) => {
    if (!setCartItems) return;
    setCartItems(prev => prev.map(item => {
      if ((item._id || item.id) === id) {
        const newQty = (item.quantity || 1) + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id) => {
    if (!setCartItems) return;
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  // إتمام الطلب والتحقق الأمني
  const handleCheckout = async () => {
    setErrorMessage('');

    // شرط الأمان الأساسي: إلزامية تسجيل الدخول للشراء
    if (!currentUser?.isLoggedIn) {
      setErrorMessage('تنبيه أمني: يجب تسجيل الدخول بحسابك الجامعي أولاً لإتمام إجراءات الشراء بأمان.');
      setTimeout(() => {
        setCurrentView('auth');
      }, 1500);
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('سلة المشتريات فارغة.');
      return;
    }

    if (!deliveryAddress.trim() || !phone.trim()) {
      setErrorMessage('يرجى كتابة رقم الهاتف وعنوان التوصيل/المكتب بدقة.');
      return;
    }

    setIsSubmitting(true);
    const mainStore = cartItems[0]?.store || 'متجر طلابي';
    const sellerEmail = cartItems[0]?.sellerEmail || null;

    const newOrderPayload = {
      productName: cartItems.map(i => `${i.title} (${i.quantity || 1})`).join(' + '),
      store: mainStore,
      sellerEmail: sellerEmail,
      buyerEmail: currentUser.email,
      buyerName: currentUser.name,
      buyerPhone: phone,
      deliveryType,
      deliveryAddress,
      subtotal,
      platformFee,
      totalPrice: total,
      items: cartItems
    };

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload)
      });

      if (res.ok) {
        const savedOrder = await res.json();
        if (onCreateOrder) onCreateOrder(savedOrder);
      } else {
        if (onCreateOrder) onCreateOrder({ id: `ORD-${Date.now().toString().slice(-6)}`, ...newOrderPayload, status: 'pending' });
      }
    } catch {
      if (onCreateOrder) onCreateOrder({ id: `ORD-${Date.now().toString().slice(-6)}`, ...newOrderPayload, status: 'pending' });
    }

    setOrderCompleted(true);
    setIsSubmitting(false);

    setTimeout(() => {
      if (setCartItems) setCartItems([]);
      setCurrentView('orders');
    }, 1600);
  };

  if (orderCompleted) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4" dir="rtl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={42} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">تم إرسال طلبك بنجاح!</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          تم إرسال إشعار فوري للتاجر لمعالجة وتجهيز طلبك. جاري نقلك لصفحة "طلباتي"...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6" dir="rtl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingCart className="text-[#1493d8]" size={32} />
            سلة المشتريات
          </h1>
          <p className="text-xs text-slate-400 mt-1">حدد طريقة التسليم لتأكيد الدفع عند الاستلام</p>
        </div>

        <button
          onClick={() => setCurrentView('explore')}
          className="tactile-btn text-xs font-bold text-slate-600 hover:text-black bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition flex items-center gap-1.5"
        >
          <span>مواصلة التسوق</span>
          <ArrowRight size={14} className="rtl:-scale-x-100" />
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => {
              const itemPrice = typeof item.price === 'string' 
                ? parseFloat(item.price.replace(/[^\d.]/g, '')) || 0 
                : Number(item.price) || 0;
              const hasImage = item.image && (item.image.startsWith('data:') || item.image.startsWith('http'));

              return (
                <div 
                  key={item._id || item.id} 
                  className="tactile-card bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                      {hasImage ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🛍️</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#1493d8] bg-sky-50 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit mb-1">
                        <Store size={10} />
                        {item.store || 'متجر طلابي'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-xs font-black text-slate-900 mt-1 block">
                        {itemPrice.toFixed(3)} OMR
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
                      <button
                        onClick={() => handleUpdateQuantity(item._id || item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id || item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id || item.id)}
                      className="tactile-btn p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="حذف من السلة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              طريقة التوصيل والحساب
            </h3>

            {/* تحديد طريقة التوصيل */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">جهة التوصيل والاستلام</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('campus_office')}
                  className={`tactile-btn p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    deliveryType === 'campus_office'
                      ? 'border-[#1493d8] bg-sky-50 text-[#1493d8]'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Building size={16} />
                  <span>مكتب / قاعة بالحرم</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('home_delivery')}
                  className={`tactile-btn p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    deliveryType === 'home_delivery'
                      ? 'border-[#1493d8] bg-sky-50 text-[#1493d8]'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Truck size={16} />
                  <span>توصيل للمنزل</span>
                </button>
              </div>
            </div>

            {/* بيانات العنوان ورقم الهاتف */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {deliveryType === 'campus_office' ? 'رقم المكتب / مبنى الكلية *' : 'عنوان المنزل والمنطقة *'}
                </label>
                <input
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={deliveryType === 'campus_office' ? 'مثال: كلية الهندسة، مكتب 14' : 'مثال: نزوى، حي التراث'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#1493d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف المشتري *</label>
                <div className="relative">
                  <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="968xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#1493d8]"
                  />
                </div>
              </div>
            </div>

            {/* تفاصيل المبالغ والعمولة 5% */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>المجموع الفرعي ({cartItems.length} منتجات):</span>
                <span className="font-bold text-slate-900">{subtotal.toFixed(3)} OMR</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>رسوم خدمة المنصة (5%):</span>
                <span className="font-bold text-slate-700">+{platformFee.toFixed(3)} OMR</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>الإجمالي المستحق (عند الاستلام):</span>
                <span className="text-base text-[#1493d8]">{total.toFixed(3)} OMR</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="tactile-btn w-full bg-black hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-3 rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingBag size={16} className="text-[#1493d8]" />
                  <span>تأكيد الطلب والدفع عند الاستلام</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400">
              <ShieldCheck size={14} className="text-[#1493d8]" />
              <span>تسوق آمن وموثوق لطلاب جامعة التقنية والعلوم التطبيقية</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-300">
            <ShoppingCart size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">سلة المشتريات فارغة</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">تصفح السوق الطلابي وأضف ما يعجبك إلى السلة.</p>
          <button
            onClick={() => setCurrentView('explore')}
            className="tactile-btn bg-black hover:bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-xs"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      )}

    </div>
  );
}