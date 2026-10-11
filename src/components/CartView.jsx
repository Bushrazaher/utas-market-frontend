import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  MapPin, Phone, Mail, User, Info, CheckCircle2, 
  AlertTriangle, Truck, Clock, Lock
} from 'lucide-react';
import { API_URL } from '../config';

export default function CartView({ cartItems = [], setCartItems, currentUser, setCurrentView, onBack }) {
  const [deliveryType, setDeliveryType] = useState('campus_pickup'); // campus_pickup, campus_office, home_delivery
  const [phone, setPhone] = useState(currentUser?.storePhone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // تسعير رسوم التوصيل حسب الخيار المتبع
  const deliveryOptions = {
    campus_pickup: { title: 'استلام مباشر من موقع المتجر بالحرم', fee: 0.000, desc: 'مجاناً - التنسيق عبر واتساب المتجر' },
    campus_office: { title: 'توصيل لقاعات ومكاتب الحرم الجامعي', fee: 0.300, desc: 'تسليم سريع بين المحاضرات' },
    home_delivery: { title: 'توصيل منزلي / خارج الحرم الجامعي', fee: 1.200, desc: 'يصل إلى باب منزلك أو السكن' }
  };

  const selectedDelivery = deliveryOptions[deliveryType];

  // الحسابات المالية
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const platformFee = Number((subtotal * 0.05).toFixed(3));
  const deliveryFee = subtotal > 0 ? selectedDelivery.fee : 0;
  const total = Math.max(0, Number((subtotal + platformFee + deliveryFee - discount).toFixed(3)));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'UTAS10') {
      const disc = Number((subtotal * 0.10).toFixed(3));
      setDiscount(disc);
      setErrorMsg('');
      setSuccessMsg('تم تطبيق خصم 10% بنجاح!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg('كود الخصم غير صحيح');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const handleUpdateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if ((item._id || item.id) === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    setErrorMsg('');

    // 1. فحص تسجيل الدخول
    if (!currentUser?.isLoggedIn) {
      setErrorMsg('أمان السلة: يجب عليك تسجيل الدخول أولاً لتأكيد طلبك وتتبعه.');
      setTimeout(() => setCurrentView('auth'), 1800);
      return;
    }

    // 2. التحقق من رقم الهاتف
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('يرجى إدخال رقم هاتف صالح (8 أرقام على الأقل) للتواصل والتسليم.');
      return;
    }

    // 3. التحقق من البريد
    if (!email || !email.includes('@')) {
      setErrorMsg('يرجى إدخال بريد إلكتروني صالح لاستلام إشعار الفاتورة.');
      return;
    }

    // 4. التحقق من مكان التسليم
    if (!address.trim()) {
      setErrorMsg('يرجى تحديد مكان أو قاعة أو عنوان التسليم بالتفصيل.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('utas_token');
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: cartItems,
          buyerName: currentUser.name,
          buyerEmail: email.trim(),
          buyerPhone: cleanPhone,
          deliveryType,
          deliveryAddress: address.trim(),
          deliveryFee,
          subtotal,
          paymentMethod: 'الدفع عند الاستلام نقداً بالحرم'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'تعذر إتمام الطلب.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('🎉 تم إرسال طلبك بنجاح وإشعار أصحاب المتاجر! جاري تحويلك لصفحة طلباتي...');
      setCartItems([]);
      localStorage.removeItem('utas_cart');

      setTimeout(() => {
        setCurrentView('orders');
      }, 2000);

    } catch (err) {
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16 max-w-6xl mx-auto" dir="rtl">
      
      {/* 1. الشريط العلوي */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack || (() => setCurrentView('explore'))}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowRight size={16} />
          <span>رجوع</span>
        </button>

        <div className="flex items-center gap-2 text-white font-black text-lg">
          <span>سلة المشتريات</span>
          <ShoppingBag className="text-[#1877F2]" size={22} />
        </div>
      </div>

      {/* تنبيهات النظام */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* إشعار نظام المبيعات الإلكترونية والتسليم */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-xs text-sky-200 flex items-start gap-3">
        <Info size={20} className="text-[#1877F2] shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold text-white">نظام التجارة الإلكترونية والتسليم الجامعي المعتمد:</p>
          <p className="text-[11px] text-slate-300">
            وفقاً لضوابط المنصة، يتم إشعار البائع فورياً بمجرد تأكيدك للطلب. يُسلّم الطلب بالحرم الجامعي أو عبر التوصيل خلال ساعات الدوام، وتتم المحاسبة مباشرة عند الاستلام لضمان معاينة وجودة المنتج.
          </p>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 2. قائمة المنتجات ونموذج بيانات التوصيل */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* عناصر السلة */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 block mb-1">المنتجات المحددة ({cartItems.length})</span>
              {cartItems.map((item) => {
                const id = item._id || item.id;
                return (
                  <div 
                    key={id}
                    className="p-4 rounded-3xl bg-[#131b2e] border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img 
                        src={item.image || 'https://placehold.co/100'} 
                        alt="" 
                        className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0" 
                      />
                      <div className="min-w-0 space-y-1">
                        <span className="text-[10px] text-sky-400 font-bold block">{item.store || 'متجر طلابي'}</span>
                        <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                        <span className="text-xs font-black text-emerald-400 font-mono block">
                          OMR {Number(item.price).toFixed(3)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2 bg-black/40 border border-white/15 px-2.5 py-1 rounded-xl text-xs font-bold">
                        <button onClick={() => handleUpdateQuantity(id, -1)} className="text-slate-400 hover:text-white">-</button>
                        <span className="px-1 text-white">{item.quantity || 1}</span>
                        <button onClick={() => handleUpdateQuantity(id, 1)} className="text-slate-400 hover:text-white">+</button>
                      </div>

                      <button 
                        onClick={() => handleRemoveItem(id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition"
                        title="حذف من السلة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* بطاقة إدخال بيانات المشتري وطريقة التوصيل */}
            <div className="p-6 bg-[#131b2e] border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Truck className="text-[#1877F2]" size={18} />
                <span>خيارات وبيانات التوصيل والتواصل</span>
              </div>

              {/* اختيار نوع التوصيل */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">طريقة التوصيل والرسوم المتبعة *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {Object.entries(deliveryOptions).map(([key, opt]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDeliveryType(key)}
                      className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                        deliveryType === key 
                          ? 'bg-blue-500/20 border-[#1877F2] text-white' 
                          : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-[11px] font-bold block mb-1 text-white">{opt.title}</span>
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {opt.fee === 0 ? 'مجاناً' : `+${opt.fee.toFixed(3)} OMR`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* حقول الاتصال والعنوان */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">البريد الإلكتروني للطلب *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="student@utas.edu.om"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-3 py-2 text-xs outline-none focus:border-[#1877F2] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">رقم الهاتف للتواصل والتسليم *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="968xxxxxxx"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-3 py-2 text-xs outline-none focus:border-[#1877F2] text-white font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {deliveryType === 'home_delivery' ? 'عنوان المنزل بالتفصيل *' : 'موقع التسليم وقاعة/مبنى الحرم الجامعي *'}
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      placeholder={deliveryType === 'home_delivery' ? 'المدينة، المنطقة، رقم المنزل...' : 'مثال: كلية الهندسة - معمل الحاسب 2 أو مكتب الأنشطة'}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-3 py-2 text-xs outline-none focus:border-[#1877F2] text-white"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 3. شريط ملخص الطلب والزر الآمن لإتمام الشراء */}
          <div className="lg:col-span-5 bg-[#131b2e] border border-white/10 rounded-3xl p-6 space-y-5 sticky top-24">
            <h3 className="font-black text-sm text-white">ملخص الطلب والفاتورة</h3>

            <div className="space-y-3 text-xs divide-y divide-white/5">
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">المجموع الفرعي</span>
                <span className="font-mono text-white font-bold">OMR {subtotal.toFixed(3)}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">رسوم دعم المنصة (5%)</span>
                <span className="font-mono text-white font-bold">OMR {platformFee.toFixed(3)}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">رسوم التوصيل المحددة</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {deliveryFee === 0 ? 'مجاناً' : `OMR ${deliveryFee.toFixed(3)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center pt-2 text-emerald-400 font-bold">
                  <span>خصم الكوبون</span>
                  <span className="font-mono">- OMR {discount.toFixed(3)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 text-sm">
                <span className="font-bold text-white">الإجمالي النهائي</span>
                <span className="font-black text-sky-400 text-lg font-mono">OMR {total.toFixed(3)}</span>
              </div>
            </div>

            {/* كود الخصم */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">كود الخصم (جرب UTAS10)</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أدخل الكود"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1877F2] text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
                >
                  تطبيق
                </button>
              </div>
            </form>

            {/* زر إتمام الشراء الآمن */}
            {currentUser?.isLoggedIn ? (
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-[#1877F2] hover:bg-blue-600 disabled:opacity-50 text-white py-3.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>تأكيد وإتمام الطلب الآن ({total.toFixed(3)} OMR)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock size={16} />
                <span>تسجيل الدخول مطلوب لإتمام الشراء</span>
              </button>
            )}

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>دفع آمن عند الاستلام • حماية مشتريات الطلاب</span>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-[#131b2e] border border-white/10 rounded-3xl space-y-3">
          <ShoppingBag size={48} className="mx-auto text-slate-500 opacity-60" />
          <h3 className="font-black text-base text-white">سلة مشترياتك فارغة حالياً</h3>
          <p className="text-xs text-slate-400">استكشف منتجات زملائك المبدعين وأضف ما يعجبك للسلة.</p>
          <button
            onClick={() => setCurrentView('explore')}
            className="mt-2 px-6 py-2.5 bg-[#1877F2] text-white rounded-xl text-xs font-bold transition hover:bg-blue-600"
          >
            تصفح المنتجات
          </button>
        </div>
      )}

    </div>
  );
}