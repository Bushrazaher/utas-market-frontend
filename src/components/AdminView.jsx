import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Package, 
  Trash2,
  RefreshCw,
  AlertCircle,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { API_URL } from '../config';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' | 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. جلب المنتجات
      const prodRes = await fetch(`${API_URL}/api/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.reverse());
      }

      // 2. جلب الطلبات
      const ordRes = await fetch(`${API_URL}/api/orders`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.reverse());
      }

      // 3. جلب إشعارات انضمام التجار للمشرف
      const notifRes = await fetch(`${API_URL}/api/notifications/admin@utas.edu.om`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }
    } catch (error) {
      console.error('خطأ أثناء جلب بيانات الإدارة:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // حساب إجمالي رسوم المنصة 5%
  const totalPlatformFees = orders.reduce((sum, o) => sum + (Number(o.platformFee) || 0), 0).toFixed(3);

  // حذف منتج مخالف من السيرفر وقاعدة البيانات
  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج: "${title}"؟`)) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' })

      if (response.ok) {
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        setFeedbackMsg(`تم حذف المنتج "${title}" بنجاح.`);
      }
    } catch {
      setFeedbackMsg('تعذر حذف المنتج من السيرفر.');
    }

    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6" dir="rtl">
      
      {/* الترويسة القيادية للمشرف */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black">لوحة الإشراف العليا - سوق UTAS</h1>
            <p className="text-xs text-slate-400 mt-1">
              مراقبة المتاجر والمنتجات، تحصيل رسوم المنصة (5%)، ومتابعة انضمام التجار
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-left border border-white/10">
            <span className="text-[10px] text-slate-300 block">إجمالي رسوم المنصة (5%)</span>
            <span className="text-xl font-black text-emerald-400">+{totalPlatformFees} OMR</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-left border border-white/10">
            <span className="text-[10px] text-slate-300 block">إجمالي الطلبات</span>
            <span className="text-xl font-black text-sky-400">{orders.length}</span>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* شريط التبديل بين أقسام المشرف */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
          }`}
        >
          <Bell size={14} />
          <span>إشعارات التجار ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
          }`}
        >
          <Store size={14} />
          <span>المنتجات الحية ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
          }`}
        >
          <Package size={14} />
          <span>الطلبات ({orders.length})</span>
        </button>
      </div>

      {/* محتوى المشرف */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={16} className="text-amber-500" />
            <span>إشعارات تسجيل المتاجر الجديدة الواردة للإدارة</span>
          </h2>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">لا توجد إشعارات جديدة حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-md">جديد</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">مراقبة المنتجات المعروضة في المنصة</h3>
            <button
              onClick={fetchAdminData}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-bold"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>تحديث</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.map((p) => (
              <div key={p._id || p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{p.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    المتجر: <span className="text-slate-700 font-semibold">{p.store}</span> • القسم: {p.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-900">{p.price}</span>
                  <button
                    onClick={() => handleDeleteProduct(p._id || p.id, p.title)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="حذف منتج مخالف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">سجل طلبات الشراء وحصيلة العمولات الرسمية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="p-3">المنتجات</th>
                  <th className="p-3">المشتري</th>
                  <th className="p-3">نوع التوصيل والعنوان</th>
                  <th className="p-3">الإجمالي</th>
                  <th className="p-3 text-emerald-600">رسوم 5%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold">{o.productName}</td>
                    <td className="p-3">{o.buyerName} ({o.buyerPhone})</td>
                    <td className="p-3 text-slate-500">{o.deliveryType === 'home_delivery' ? 'منزلي: ' : 'مكتب بالحرم: '}{o.deliveryAddress}</td>
                    <td className="p-3 font-bold">{o.totalPrice || o.price} OMR</td>
                    <td className="p-3 font-bold text-emerald-600">+{o.platformFee || 0} OMR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}