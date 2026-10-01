import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Store, 
  MapPin, 
  Phone, 
  RefreshCw,
  Building,
  Truck
} from 'lucide-react';
import { API_URL } from '../config';

export default function OrdersView({ 
  currentUser, 
  setCurrentView, 
  onBack, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserOrders = async () => {
    if (!currentUser?.isLoggedIn || !currentUser?.email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        // تصفية الطلبات الخاصة بالمشتري الحالي فقط بناءً على البريد الإلكتروني
        const myOrders = data.filter(o => 
          o.buyerEmail && o.buyerEmail.toLowerCase() === currentUser.email.toLowerCase()
        );
        setOrders(myOrders.reverse());
      } else {
        setErrorMessage(isEn ? 'Failed to fetch orders.' : 'تعذر جلب الطلبات من الخادم.');
      }
    } catch {
      setErrorMessage(isEn ? 'Server connection error.' : 'خطأ في الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [currentUser]);

  // دالة ترجمة وتنسيق حالة الطلب
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-3 py-1 rounded-full text-[11px] font-bold">مقبول (Accepted)</span>;
      case 'Preparing':
        return <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">قيد التجهيز (Preparing)</span>;
      case 'Ready':
        return <span className="bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 px-3 py-1 rounded-full text-[11px] font-bold">جاهز للاستلام (Ready)</span>;
      case 'Completed':
        return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold">مكتمل (Completed)</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1 rounded-full text-[11px] font-bold">ملغي (Cancelled)</span>;
      default:
        return <span className="bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 px-3 py-1 rounded-full text-[11px] font-bold">جديد (New)</span>;
    }
  };

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="w-16 h-16 bg-sky-50 text-[#1493d8] rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">يجب تسجيل الدخول أولاً</h2>
        <p className="text-xs text-slate-500">لعرض تتبع طلباتك ومشترياتك السابقة داخل الحرم الجامعي.</p>
        <button
          onClick={() => setCurrentView('auth')}
          className="px-6 py-2.5 bg-black dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-2xl shadow-md transition"
        >
          تسجيل الدخول / إنشاء حساب
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-[#1493d8] flex items-center justify-center font-bold">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">طلباتي السابقة</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">متابعة حالة الطلبات وتجهيزها للاستلام من الحرم الجامعي</p>
          </div>
        </div>

        <button
          onClick={fetchUserOrders}
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl transition text-slate-600 dark:text-slate-300 shadow-2xs"
          title="تحديث الطلبات"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold">
          {errorMessage}
        </div>
      )}

      {/* قائمة الطلبات */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-bold">جاري تحميل طلباتك...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            const shortId = orderId ? orderId.slice(-6) : '1024';

            return (
              <div 
                key={orderId} 
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                      #{shortId}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1493d8]">
                      <Store size={14} />
                      <span>{order.store || 'متجر طلابي'}</span>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {order.productName}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      {order.deliveryType === 'home_delivery' ? <Truck size={14} /> : <Building size={14} />}
                      <span>العنوان: {order.deliveryAddress || 'الحرم الجامعي'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} />
                      <span>الهاتف: {order.buyerPhone || currentUser.phone || 'غير متوفر'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <div className="text-slate-500">
                    طريقة الدفع: <span className="font-bold text-slate-700 dark:text-slate-300">الدفع عند الاستلام (Cash)</span>
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    الإجمالي: <span className="text-[#1493d8]">{order.totalPrice || order.price || 0} OMR</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-300">
            <Package size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">لا توجد طلبات سابقة</h3>
          <p className="text-xs text-slate-400 mb-4">لم تقم بإجراء أي طلبات شراء من المتاجر الطلابية حتى الآن.</p>
          <button
            onClick={() => setCurrentView('explore')}
            className="px-6 py-2.5 bg-black dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-2xl transition shadow-xs"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      )}

    </div>
  );
}