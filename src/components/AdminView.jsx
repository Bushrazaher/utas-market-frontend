import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Store, Package, ShoppingCart, 
  BarChart3, Bell, FileText, Settings, LogOut, Search, 
  CheckCircle2, XCircle, Trash2, RefreshCw, Eye, AlertTriangle 
} from 'lucide-react';
import { API_URL } from '../config';

export default function AdminView({ currentUser, setCurrentView, onBack, language = 'ar', theme = 'light' }) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview'); // overview, users, stores, products, orders, reports, notifications, content, settings
  const [pendingStores, setPendingStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [storesRes, prodRes, ordRes, noteRes] = await Promise.all([
        fetch(`${API_URL}/api/stores`),
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/orders`),
        fetch(`${API_URL}/api/notifications/${currentUser?.email || 'admin'}`)
      ]);

      if (storesRes.ok) {
        const data = await storesRes.json();
        setStores(data);
        setPendingStores(data.filter(s => s.storeStatus === 'pending' || !s.isStoreConfigured));
      }
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (noteRes.ok) setNotifications(await noteRes.json());
    } catch (error) {
      console.error('خطأ أثناء جلب بيانات المشرف:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDecision = async (userId, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/decide-store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      });
      if (res.ok) {
        setFeedbackMsg(action === 'approve' ? 'تم اعتماد المتجر بنجاح' : 'تم رفض المتجر');
        fetchAdminData();
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    }
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        setFeedbackMsg('تم حذف المنتج بنجاح.');
      }
    } catch {
      setFeedbackMsg('تعذر حذف المنتج.');
    }
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const totalPlatformFees = orders.reduce((sum, o) => sum + (Number(o.platformFee) || 0), 0).toFixed(3);

  const menuItems = [
    { id: 'overview', label: 'الرئيسية — نظرة عامة', icon: <ShieldCheck size={16} /> },
    { id: 'users', label: 'إدارة المستخدمين', icon: <Users size={16} /> },
    { id: 'stores', label: 'إدارة المتاجر', icon: <Store size={16} />, badge: pendingStores.length },
    { id: 'products', label: 'إدارة المنتجات', icon: <Package size={16} /> },
    { id: 'orders', label: 'إدارة الطلبات', icon: <ShoppingCart size={16} /> },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: <BarChart3 size={16} /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={16} />, badge: notifications.length },
    { id: 'content', label: 'المحتوى والإعلانات', icon: <FileText size={16} /> },
    { id: 'settings', label: 'إعدادات النظام', icon: <Settings size={16} /> },
  ];

  return (
    <div className={`max-w-7xl mx-auto py-6 space-y-6 ${isDark ? 'text-white' : 'text-slate-900'}`} dir="rtl">
      
      {/* رأس لوحة تحكم المشرف */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black">لوحة تحكم المشرف (Admin)</h1>
            <p className="text-xs text-slate-500">مرحباً، {currentUser?.name || 'مشرف النظام'} | إدارة صلاحيات ومتاجر المنصة</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentView('home')} 
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
          >
            الرئيسية
          </button>
          <button onClick={fetchAdminData} className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl transition" title="تحديث البيانات">
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* أشرطة التبويب الأفقية العلوية (بدلاً من الشريط الجانبي المزدوج) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition shrink-0 shadow-xs ${
              activeTab === item.id 
                ? 'bg-[#1877F2] text-white shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1493d8]'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* المحتوى الرئيسي للتبويبات */}
      <div className="space-y-6">
        
        {/* 1. الرئيسية — نظرة عامة */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* الكروت الإحصائية الأربعة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1">إجمالي المتاجر</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stores.length}</h3>
                <span className="text-[10px] font-bold text-emerald-500 mt-1 block">نشطة ومعتمدة</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1">إجمالي المنتجات</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</h3>
                <span className="text-[10px] font-bold text-blue-500 mt-1 block">معروضة للطلاب</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1">إجمالي الطلبات</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</h3>
                <span className="text-[10px] font-bold text-purple-500 mt-1 block">عبر المنصة</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-1">رسوم المنصة المحصلة (5%)</p>
                <h3 className="text-3xl font-black text-emerald-600 font-mono">+{totalPlatformFees} OMR</h3>
                <span className="text-[10px] font-bold text-slate-400 mt-1 block">أرباح لدعم الأنشطة</span>
              </div>
            </div>

            {/* قسم طلبات تحتاج إلى مراجعة عاجلة */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-amber-600">
                <AlertTriangle size={20} />
                <span>طلبات متاجر تحتاج إلى مراجعة ({pendingStores.length})</span>
              </h3>
              {pendingStores.length > 0 ? (
                <div className="space-y-3">
                  {pendingStores.map(store => (
                    <div key={store._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">{store.storeName}</h4>
                        <p className="text-xs text-slate-500">المالك: {store.name} | البريد: {store.email} | الهاتف: {store.storePhone || 'غير متوفر'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDecision(store._id, 'approve')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition">قبول</button>
                        <button onClick={() => handleDecision(store._id, 'reject')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition">رفض</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">لا توجد طلبات متاجر معلقة في الوقت الحالي.</p>
              )}
            </div>
          </div>
        )}

        {/* 2. إدارة المستخدمين */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-black">إدارة المستخدمين</h2>
            <p className="text-xs text-slate-500">مشاهدة ومتابعة جميع مسجلي المنصة</p>
            <div className="text-center py-16 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              قائمة المستخدمين متصلة بقاعدة بيانات الحسابات الموحدة.
            </div>
          </div>
        )}

        {/* 3. إدارة المتاجر */}
        {activeTab === 'stores' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-black">إدارة المتاجر الطلابية</h2>
              <p className="text-xs text-slate-500 mt-1">مراجعة وقبول وإيقاف المتاجر</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-bold">المتجر</th>
                    <th className="p-4 font-bold">المالك</th>
                    <th className="p-4 font-bold">البريد</th>
                    <th className="p-4 font-bold text-center">الحالة</th>
                    <th className="p-4 font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {stores.map(st => (
                    <tr key={st._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-bold">{st.storeName}</td>
                      <td className="p-4 text-xs">{st.name}</td>
                      <td className="p-4 text-xs text-slate-500">{st.email}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${st.storeStatus === 'approved' || st.isStoreConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {st.storeStatus === 'approved' || st.isStoreConfigured ? 'فعال' : 'بانتظار المراجعة'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDecision(st._id, st.isStoreConfigured ? 'reject' : 'approve')} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition">
                          {st.isStoreConfigured ? 'إيقاف' : 'اعتماد'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. إدارة المنتجات */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-black">إدارة المنتجات</h2>
              <p className="text-xs text-slate-500 mt-1">مراجعة وحذف المنتجات المخالفة في المنصة</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-bold">صورة</th>
                    <th className="p-4 font-bold">اسم المنتج</th>
                    <th className="p-4 font-bold">المتجر</th>
                    <th className="p-4 font-bold">السعر</th>
                    <th className="p-4 font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {products.map(p => (
                    <tr key={p._id || p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4"><img src={p.image} className="w-10 h-10 rounded-lg object-cover border" alt="" /></td>
                      <td className="p-4 font-bold text-xs">{p.title}</td>
                      <td className="p-4 text-xs text-slate-500">{p.store}</td>
                      <td className="p-4 font-bold text-xs">{p.price}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteProduct(p._id || p.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition" title="حذف المنتج">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. إدارة الطلبات */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-black">إدارة الطلبات</h2>
              <p className="text-xs text-slate-500 mt-1">متابعة كافة طلبات المتاجر وحالاتها</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-bold"># الطلب</th>
                    <th className="p-4 font-bold">المنتجات</th>
                    <th className="p-4 font-bold">المتجر</th>
                    <th className="p-4 font-bold">المشتري</th>
                    <th className="p-4 font-bold">الإجمالي</th>
                    <th className="p-4 font-bold text-emerald-600">رسوم 5%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-bold text-xs">#{o._id.slice(-4)}</td>
                      <td className="p-4 font-bold text-xs max-w-[200px] truncate">{o.productName}</td>
                      <td className="p-4 text-xs text-slate-500">{o.store}</td>
                      <td className="p-4 text-xs">{o.buyerName}</td>
                      <td className="p-4 font-bold text-xs">{o.totalPrice || o.price || 0} OMR</td>
                      <td className="p-4 font-bold text-emerald-600 text-xs">+{o.platformFee || 0} OMR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* باقي الأقسام العادية */}
        {['reports', 'notifications', 'content', 'settings'].includes(activeTab) && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-black">قسم {menuItems.find(m => m.id === activeTab)?.label}</h2>
            <p className="text-xs text-slate-500">هذه اللوحة مخصصة لتحكم المشرف الكامل بخصائص المنصة وإعداداتها.</p>
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold">
              تم تفعيل وإعداد هذا القسم ضمن صلاحيات المشرف العليا في قاعدة البيانات.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}