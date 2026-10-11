import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle2, AlertCircle, 
  ArrowRight, RefreshCw, ShoppingBag, MapPin, 
  Phone, User, Truck, ShieldAlert 
} from 'lucide-react';
import { API_URL } from '../config';

export default function OrdersView({ currentUser, setCurrentView, onBack, language = 'ar', theme = 'light' }) {
  const isEn = language === 'en';
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg('');

    const token = localStorage.getItem('utas_token') || localStorage.getItem('token') || '';
    const userEmail = currentUser?.email || 'buyer@utas.edu.om';

    try {
      const res = await fetch(`${API_URL}/api/orders?email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-user-email': userEmail
        }
      });

      if (!res.ok) {
        throw new Error('تعذر جلب الطلبات من الخادم.');
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.message || 'تعذر جلب الطلبات من الخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return { text: 'طلب جديد', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
      case 'Accepted':
        return { text: 'تم القبول', color: 'bg-sky-500/10 text-sky-600 border-sky-500/30' };
      case 'Preparing':
        return { text: 'قيد التجهيز', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
      case 'Ready':
        return { text: 'جاهز للاستلام', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' };
      case 'Completed':
        return { text: 'مكتمل ومستلم', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' };
      case 'Cancelled':
        return { text: 'ملغي', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' };
      default:
        return { text: status || 'معلق', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16 max-w-5xl mx-auto" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* 1. رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1877F2]">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              طلباتي السابقة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              متابعة حالة الطلبات وتجهيزها للاستلام من الحرم الجامعي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-xs"
            title="تحديث القائمة"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>تحديث</span>
          </button>

          <button
            onClick={onBack || (() => setCurrentView('explore'))}
            className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            <span>متابعة التسوق</span>
            <ArrowRight size={14} className={isEn ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* رسالة الخطأ */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setCurrentView('auth')}
            className="underline hover:text-rose-900 font-black"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      )}

      {/* 2. عرض المحتوى */}
      {isLoading ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-3">
          <RefreshCw size={32} className="mx-auto text-[#1877F2] animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">جاري تحميل سجل طلباتك...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 transition shadow-xs hover:shadow-md space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-[#1877F2]">
                      #{order.orderNumber || order._id.slice(-6)}
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      متجر: <strong className="text-slate-900 dark:text-white">{order.store}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {order.date || new Date(order.createdAt).toLocaleDateString('ar-OM')}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {order.productName}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#1877F2] shrink-0" />
                      <span>مكان التسليم: {order.deliveryAddress || 'الحرم الجامعي'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-amber-500 shrink-0" />
                      <span>طريقة الاستلام: {order.deliveryType === 'home_delivery' ? 'توصيل منزلي' : 'تسليم داخل الحرم'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <span className="text-slate-500">طريقة الدفع: {order.paymentMethod || 'الدفع عند الاستلام'}</span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">الإجمالي:</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {order.totalPrice ? `${Number(order.totalPrice).toFixed(3)} ر.ع` : order.price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Package size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-base text-slate-900 dark:text-white">لا توجد طلبات سابقة</h3>
            <p className="text-xs text-slate-400">لم تقم بإجراء أي طلبات شراء من المتاجر الطلابية حتى الآن.</p>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="px-6 py-2.5 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      )}

    </div>
  );
}