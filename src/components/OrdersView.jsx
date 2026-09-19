import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Package, 
  Store, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '../config';

export default function OrdersView({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // جلب بيانات المستخدم المسجل من الـ Props أو من التخزين المحلي
  const currentUser = user || JSON.parse(localStorage.getItem('utas_user') || '{}');

  const fetchUserOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      if (!res.ok) {
        throw new Error('تعذر تحميل سجل الطلبات من الخادم');
      }
      const data = await res.json();

      // تصفية الطلبات الخاصة بالمستخدم الحالي فقط (بواسطة البريد الجامعي)
      const userOrders = currentUser?.email
        ? data.filter(order => order.buyerEmail?.toLowerCase() === currentUser.email.toLowerCase())
        : data;

      setOrders(userOrders);
    } catch (err) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء جلب الطلبات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [currentUser?.email]);

  const filteredOrders = orders.filter((o) => {
    const status = o.status || 'pending';
    if (filter === 'pending') return status === 'pending';
    if (filter === 'completed') return status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir="rtl">
      
      {/* البنر العلوي */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#1493d8]">
            <Package size={14} />
            <span>سجل المعاملات والطلبيات السحابي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            طلباتك السابقة <br />
            <span className="text-[#1493d8]">في UTAS Market</span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-1">
            تابع حالة استلام وجباتك أو مذكراتك الأكاديمية وتواصل مع البائع الجامعي بسهولة.
          </p>
        </div>
      </section>

      {/* أزرار الفرز وتحديث البيانات */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-bold border transition ${
              filter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            جميع الطلبات ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-bold border transition ${
              filter === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            قيد التجهيز
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-bold border transition ${
              filter === 'completed' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            المكتملة والمسلّمة
          </button>
        </div>

        <button
          onClick={fetchUserOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* حالة الخطأ */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-bold">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* حالة جلب البيانات */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-5 rounded-3xl border border-slate-200 animate-pulse flex justify-between items-center h-24">
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        /* قائمة الطلبات المسترجعة من MongoDB */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === 'completed';
            const orderDate = order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString('ar-OM', { year: 'numeric', month: 'short', day: 'numeric' })
              : 'حديثاً';
            const displayPrice = order.totalPrice ? `${Number(order.totalPrice).toFixed(3)} ر.ع` : (order.price || '0.000 ر.ع');
            const shortId = order._id ? `#${order._id.slice(-6).toUpperCase()}` : order.id;

            return (
              <div 
                key={order._id || order.id} 
                className="tactile-card bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 font-mono">{shortId}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      <span>{isCompleted ? 'تم الاستلام بنجاح' : 'جاري إعداد الطلب'}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800">{order.productName}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Store size={13} className="text-[#1493d8]" />
                      <span>{order.store || 'متجر معتمد'}</span>
                    </span>
                    <span>•</span>
                    <span>{orderDate}</span>
                    <span>•</span>
                    <span>{order.deliveryType === 'home_delivery' ? 'توصيل منزلي' : 'تسليم بالحرم الجامعي'}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-base font-black text-slate-900 block">{displayPrice}</span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {order.deliveryType === 'home_delivery' ? 'توصيل للمنزل' : 'تسليم مباشر بالحرم'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold space-y-2">
          <ShoppingBag size={28} className="mx-auto text-slate-300" />
          <p>لا توجد طلبات مسجلة في حسابك حتى الآن.</p>
        </div>
      )}

    </div>
  );
}