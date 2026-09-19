import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Package, 
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Bell
} from 'lucide-react';
import { API_URL } from '../config';

export default function AdminView({ language = 'ar', theme = 'light' }) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'products' | 'orders'
  const [pendingStores, setPendingStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. جلب طلبات المتاجر المعلقة
      const storesRes = await fetch(`${API_URL}/api/admin/pending-stores`);
      if (storesRes.ok) {
        const storesData = await storesRes.json();
        setPendingStores(storesData);
      }

      // 2. جلب المنتجات
      const prodRes = await fetch(`${API_URL}/api/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      // 3. جلب الطلبات
      const ordRes = await fetch(`${API_URL}/api/orders`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
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

  // اتخاذ قرار اعتماد أو رفض المتجر مباشرة من اللوحة
  const handleDecision = async (userId, action) => {
    setActionLoading(userId);
    setFeedbackMsg('');
    try {
      const res = await fetch(`${API_URL}/api/admin/decide-store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      });

      if (res.ok) {
        setFeedbackMsg(action === 'approve' 
          ? (isEn ? 'Store approved and activated successfully!' : 'تم اعتماد وتفعيل المتجر بنجاح!') 
          : (isEn ? 'Store request rejected.' : 'تم رفض طلب المتجر.'));
        setPendingStores(prev => prev.filter(s => s._id !== userId));
      } else {
        alert(isEn ? 'Failed to execute decision' : 'تعذر تنفيذ القرار');
      }
    } catch {
      alert(isEn ? 'Server connection error' : 'خطأ في الاتصال بالخادم');
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  // حذف منتج مخالف من المنصة
  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(isEn ? `Are you sure you want to delete "${title}"?` : `هل أنت متأكد من حذف المنتج: "${title}"؟`)) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        setFeedbackMsg(isEn ? `Product "${title}" deleted successfully.` : `تم حذف المنتج "${title}" بنجاح.`);
      }
    } catch {
      setFeedbackMsg(isEn ? 'Failed to delete product.' : 'تعذر حذف المنتج من السيرفر.');
    }
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // حساب إجمالي رسوم المنصة 5%
  const totalPlatformFees = orders.reduce((sum, o) => sum + (Number(o.platformFee) || 0), 0).toFixed(3);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* الترويسة القيادية للمشرف */}
      <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-950 text-white border-slate-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">
              {isEn ? 'Supervision Panel - UTAS Market' : 'لوحة الإشراف العليا - سوق UTAS'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isEn ? 'Supervise stores, approve merchants, and review platform fees (5%)' : 'مراقبة المتاجر والمنتجات، تحصيل رسوم المنصة (5%)، ومتابعة انضمام التجار'}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-left border border-white/10">
            <span className="text-[10px] text-slate-300 block">{isEn ? 'Platform Fees (5%)' : 'إجمالي رسوم المنصة (5%)'}</span>
            <span className="text-xl font-black text-emerald-400 font-mono">+{totalPlatformFees} OMR</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-left border border-white/10">
            <span className="text-[10px] text-slate-300 block">{isEn ? 'Total Orders' : 'إجمالي الطلبات'}</span>
            <span className="text-xl font-black text-sky-400 font-mono">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* رسالة تأكيد العمليات */}
      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* شريط التبديل بين أقسام المشرف */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg">
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'stores' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell size={14} className={pendingStores.length > 0 ? 'text-amber-500 animate-bounce' : ''} />
            <span>{isEn ? `Store Requests (${pendingStores.length})` : `طلبات المتاجر (${pendingStores.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'products' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Store size={14} />
            <span>{isEn ? `Live Products (${products.length})` : `المنتجات الحية (${products.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package size={14} />
            <span>{isEn ? `Orders (${orders.length})` : `الطلبات (${orders.length})`}</span>
          </button>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 text-xs font-bold"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{isEn ? 'Refresh' : 'تحديث'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. تبويب طلبات المتاجر المعلقة                             */}
      {/* ========================================================= */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-xs font-bold text-slate-400">
              {isEn ? 'Loading store requests...' : 'جاري تحميل طلبات المتاجر...'}
            </div>
          ) : pendingStores.length > 0 ? (
            pendingStores.map((storeUser) => (
              <div
                key={storeUser._id}
                className={`p-5 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition shadow-xs ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900 dark:text-white">{storeUser.storeName}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock size={11} />
                      <span>{isEn ? 'Pending Review' : 'قيد المراجعة'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    {storeUser.storeDesc || (isEn ? 'No description provided.' : 'لا يوجد وصف مضاف لهذا المتجر.')}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <User size={13} className="text-[#1493d8]" />
                      <span>{storeUser.name}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} />
                      <span>{storeUser.email}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone size={13} className="text-emerald-500" />
                      <span>{storeUser.storePhone || (isEn ? 'N/A' : 'غير متوفر')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleDecision(storeUser._id, 'approve')}
                    disabled={actionLoading === storeUser._id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle2 size={15} />
                    <span>{isEn ? 'Approve & Activate' : 'اعتماد وتفعيل'}</span>
                  </button>

                  <button
                    onClick={() => handleDecision(storeUser._id, 'reject')}
                    disabled={actionLoading === storeUser._id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    <XCircle size={15} />
                    <span>{isEn ? 'Reject' : 'رفض'}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-20 rounded-3xl border border-dashed text-slate-400 text-xs font-bold space-y-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <CheckCircle2 size={28} className="mx-auto text-emerald-500" />
              <p>{isEn ? 'All store requests have been processed. No pending requests.' : 'تمت معالجة كافة طلبات المتاجر، لا توجد طلبات معلقة حالياً.'}</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. تبويب مراقبة المنتجات الحية                            */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className={`rounded-3xl border shadow-xs overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.length > 0 ? (
              products.map((p) => (
                <div key={p._id || p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isEn ? 'Store:' : 'المتجر:'} <span className="font-semibold text-slate-700 dark:text-slate-300">{p.store}</span> • {p.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black font-mono">{p.price}</span>
                    <button
                      onClick={() => handleDeleteProduct(p._id || p.id, p.title)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                      title={isEn ? 'Delete product' : 'حذف منتج مخالف'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">{isEn ? 'No products found.' : 'لا توجد منتجات مسجلة.'}</p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. تبويب سجل الطلبات والعمولات                            */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className={`rounded-3xl border shadow-xs overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs" dir={isEn ? 'ltr' : 'rtl'}>
              <thead className={`border-b text-slate-500 ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <tr>
                  <th className="p-3.5">{isEn ? 'Products' : 'المنتجات'}</th>
                  <th className="p-3.5">{isEn ? 'Buyer' : 'المشتري'}</th>
                  <th className="p-3.5">{isEn ? 'Delivery Type & Address' : 'نوع التوصيل والعنوان'}</th>
                  <th className="p-3.5">{isEn ? 'Total' : 'الإجمالي'}</th>
                  <th className="p-3.5 text-emerald-600">{isEn ? 'Fee 5%' : 'رسوم 5%'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.length > 0 ? (
                  orders.map((o) => (
                    <tr key={o._id || o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 font-bold">{o.productName}</td>
                      <td className="p-3.5">{o.buyerName} ({o.buyerPhone})</td>
                      <td className="p-3.5 text-slate-500">
                        {o.deliveryType === 'home_delivery' ? (isEn ? 'Home: ' : 'منزلي: ') : (isEn ? 'Campus: ' : 'مكتب بالحرم: ')}
                        {o.deliveryAddress}
                      </td>
                      <td className="p-3.5 font-bold font-mono">{o.totalPrice || o.price} OMR</td>
                      <td className="p-3.5 font-bold text-emerald-600 font-mono">+{o.platformFee || 0} OMR</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                      {isEn ? 'No orders recorded yet.' : 'لا توجد طلبات مسجلة حتى الآن.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}