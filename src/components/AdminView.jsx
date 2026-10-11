import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Store, Package, ShoppingCart, 
  BarChart3, Bell, FileText, Settings, Search, 
  CheckCircle2, XCircle, Trash2, RefreshCw, AlertTriangle,
  ArrowRight, Plus, Eye, Save, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { API_URL } from '../config';

export default function AdminView({ currentUser, setCurrentView }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({
    totalUsers: 0, totalStores: 0, totalProducts: 0, 
    totalOrders: 0, totalSales: '0.000', totalPlatformFees: '0.000'
  });

  const [stores, setStores] = useState([]);
  const [pendingStores, setPendingStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [banners, setBanners] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    platformFee: 5,
    adminEmail: 'admin@utas.edu.om',
    deliveryPolicy: 'مكاتب الحرم والتوصيل المنزلي'
  });

  // نموذج إضافة إعلان وبنر جديد
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    image: '',
    badge: 'عرض خاص',
    bgColor: 'from-[#1877F2] to-blue-900',
    buttonText: 'تسوق الآن'
  });

  const gradientOptions = [
    { label: 'أزرق ملكي (UTAS Blue)', value: 'from-[#1877F2] to-blue-900' },
    { label: 'بنفسجي جامعي', value: 'from-purple-600 to-indigo-900' },
    { label: 'أخضر زمردي', value: 'from-emerald-600 to-teal-900' },
    { label: 'كهرماني دافئ', value: 'from-amber-500 to-orange-800' },
    { label: 'أحمر قرمزي', value: 'from-rose-600 to-red-900' },
    { label: 'رمادي داكن', value: 'from-slate-800 to-slate-950' }
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getHeaders = () => {
    const token = localStorage.getItem('utas_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    const headers = getHeaders();
    try {
      const [statsRes, storesRes, pendingRes, prodRes, ordRes, usersRes, noteRes, bannerRes, setRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/stores`),
        fetch(`${API_URL}/api/admin/pending-stores`, { headers }),
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/orders`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/notifications/${currentUser?.email || 'admin@utas.edu.om'}`, { headers }),
        fetch(`${API_URL}/api/banners`),
        fetch(`${API_URL}/api/settings`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (storesRes.ok) setStores(await storesRes.json());
      if (pendingRes.ok) setPendingStores(await pendingRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (noteRes.ok) setNotifications(await noteRes.json());
      if (bannerRes.ok) setBanners(await bannerRes.json());
      if (setRes.ok) setSystemSettings(await setRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 1. اعتماد أو رفض المتجر
  const handleDecideStore = async (userId, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/decide-store`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, action })
      });
      if (res.ok) {
        showFeedback(action === 'approve' ? '✅ تم اعتماد المتجر وتفعيله في قاعدة البيانات!' : '❌ تم رفض المتجر.');
        fetchAllData();
      }
    } catch {
      showFeedback('خطأ في الاتصال بالخادم');
    }
  };

  // 2. تغيير رتبة المستخدم
  const handleChangeUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showFeedback(`✅ تم تغيير دور المستخدم إلى "${newRole}" في قاعدة البيانات.`);
        fetchAllData();
      }
    } catch {
      showFeedback('تعذر تعديل رتبة المستخدم');
    }
  };

  // 3. حذف مستخدم
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        showFeedback('✅ تم حذف الحساب بنجاح.');
        fetchAllData();
      }
    } catch {
      showFeedback('تعذر حذف الحساب');
    }
  };

  // 4. حذف منتج
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${prodId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        showFeedback('✅ تم حذف المنتج من قاعدة البيانات.');
        fetchAllData();
      }
    } catch {
      showFeedback('تعذر حذف المنتج');
    }
  };

  // 5. تحديث حالة الطلب
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showFeedback(`✅ تم تحديث حالة الطلب إلى "${newStatus}".`);
        fetchAllData();
      }
    } catch {
      showFeedback('تعذر تحديث حالة الطلب');
    }
  };

  // 6. إضافة وحفظ إعلان جديد في MongoDB
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.image) {
      showFeedback('يرجى كتابة عنوان الإعلان ورابط الصورة على الأقل.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/banners`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newBanner)
      });

      if (res.ok) {
        showFeedback('✅ تم حفظ ونشر الإعلان الجديد في قاعدة البيانات بنجاح!');
        setNewBanner({
          title: '',
          subtitle: '',
          image: '',
          badge: 'عرض خاص',
          bgColor: 'from-[#1877F2] to-blue-900',
          buttonText: 'تسوق الآن'
        });
        fetchAllData();
      } else {
        showFeedback('تعذر إضافة الإعلان.');
      }
    } catch {
      showFeedback('خطأ في الاتصال بالخادم.');
    }
  };

  // 7. حذف إعلان من قاعدة البيانات
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان من الصفحة الرئيسية؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/banners/${bannerId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        showFeedback('✅ تم حذف الإعلان بنجاح.');
        fetchAllData();
      }
    } catch {
      showFeedback('تعذر حذف الإعلان');
    }
  };

  // 8. حفظ إعدادات النظام
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(systemSettings)
      });
      if (res.ok) {
        showFeedback('✅ تم حفظ إعدادات المنصة في قاعدة البيانات بنجاح!');
        fetchAllData();
      }
    } catch {
      showFeedback('تعذر حفظ الإعدادات');
    }
  };

  const tabs = [
    { id: 'overview', label: 'الرئيسية — نظرة عامة', icon: <ShieldCheck size={16} /> },
    { id: 'users', label: 'إدارة المستخدمين', icon: <Users size={16} /> },
    { id: 'stores', label: 'إدارة المتاجر', icon: <Store size={16} />, badge: pendingStores.length },
    { id: 'products', label: 'إدارة المنتجات', icon: <Package size={16} /> },
    { id: 'orders', label: 'إدارة الطلبات', icon: <ShoppingCart size={16} /> },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: <BarChart3 size={16} /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell size={16} />, badge: notifications.filter(n => !n.isRead).length },
    { id: 'content', label: 'المحتوى والإعلانات', icon: <FileText size={16} />, badge: banners.length },
    { id: 'settings', label: 'إعدادات النظام', icon: <Settings size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-red-500 shadow-md">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">لوحة تحكم المشرف (Admin)</h1>
            <p className="text-xs text-slate-400">إدارة مباشرة ومتزامنة مع قاعدة بيانات MongoDB</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchAllData} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>تحديث فورى</span>
          </button>
          <button onClick={() => setCurrentView('home')} className="px-4 py-2.5 bg-[#1877F2] hover:bg-blue-600 rounded-xl text-xs font-bold text-white transition flex items-center gap-2">
            <ArrowRight size={15} className="rtl:rotate-180" />
            <span>الرئيسية</span>
          </button>
        </div>
      </header>

      {/* أزرار التبويبات */}
      <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-white/10 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === tab.id ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-black animate-pulse">{tab.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {feedbackMsg && (
        <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* المحتوى التفاعلي */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 1. نظرة عامة */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold mb-1">إجمالي المتاجر</p>
                <h3 className="text-3xl font-black text-white">{stats.totalStores}</h3>
                <span className="text-[10px] text-emerald-400 font-bold mt-2 block">معتمدة في النظام</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold mb-1">إجمالي المنتجات</p>
                <h3 className="text-3xl font-black text-white">{stats.totalProducts}</h3>
                <span className="text-[10px] text-sky-400 font-bold mt-2 block">معروضة في المتجر</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold mb-1">إجمالي الطلبات</p>
                <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
                <span className="text-[10px] text-purple-400 font-bold mt-2 block">مسجلة في القاعدة</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold mb-1">رسوم المنصة المحصلة (5%)</p>
                <h3 className="text-3xl font-black text-emerald-400 font-mono">+{stats.totalPlatformFees} OMR</h3>
                <span className="text-[10px] text-slate-400 font-bold mt-2 block">أرباح الأنشطة</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-black text-base flex items-center gap-2 text-amber-400">
                <AlertTriangle size={18} />
                <span>طلبات متاجر بانتظار الاعتماد ({pendingStores.length})</span>
              </h3>
              {pendingStores.length > 0 ? (
                <div className="space-y-3">
                  {pendingStores.map(st => (
                    <div key={st._id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{st.storeName}</h4>
                        <p className="text-xs text-slate-400">المالك: {st.name} | البريد: {st.email} | الهاتف: {st.storePhone || 'غير مسجل'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDecideStore(st._id, 'approve')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">
                          اعتماد في القاعدة
                        </button>
                        <button onClick={() => handleDecideStore(st._id, 'reject')} className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition">
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">لا توجد طلبات متاجر معلقة حالياً.</div>
              )}
            </div>
          </div>
        )}

        {/* 2. إدارة المستخدمين */}
        {activeTab === 'users' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black">إدارة المستخدمين وتعديل الرتب ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">البريد</th>
                    <th className="p-3">الدور الحالي</th>
                    <th className="p-3 text-center">تغيير الصلاحية (حفظ تلقائي)</th>
                    <th className="p-3 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-bold">{u.name}</td>
                      <td className="p-3 text-slate-400 font-mono">{u.email}</td>
                      <td className="p-3 font-bold text-sky-400">{u.role}</td>
                      <td className="p-3 text-center">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u._id, e.target.value)}
                          className="bg-black/60 border border-white/20 text-white text-[11px] rounded-lg px-2.5 py-1 outline-none cursor-pointer"
                        >
                          <option value="buyer">طالب مشتري (buyer)</option>
                          <option value="seller">بائع / تاجر (seller)</option>
                          <option value="admin">مشرف نظام (admin)</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition" title="حذف من القاعدة">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. إدارة المتاجر */}
        {activeTab === 'stores' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black">المتاجر المعتمدة ({stores.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">اسم المتجر</th>
                    <th className="p-3">المالك</th>
                    <th className="p-3">التصنيف</th>
                    <th className="p-3">الهاتف</th>
                    <th className="p-3 text-center">إجراء الإيقاف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stores.map(st => (
                    <tr key={st._id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-bold text-white">{st.storeName}</td>
                      <td className="p-3 text-slate-400">{st.name}</td>
                      <td className="p-3 text-sky-400">{st.mainCategory || 'عام'}</td>
                      <td className="p-3 text-slate-300 font-mono">{st.storePhone || '—'}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDecideStore(st._id, 'reject')} className="px-3 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg transition">
                          إيقاف المتجر
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
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black">المنتجات المعروضة ({products.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">الصورة</th>
                    <th className="p-3">المنتج</th>
                    <th className="p-3">المتجر</th>
                    <th className="p-3">السعر</th>
                    <th className="p-3 text-center">حذف من القاعدة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p._id || p.id} className="hover:bg-white/5 transition">
                      <td className="p-3"><img src={p.image || 'https://placehold.co/80'} className="w-9 h-9 rounded-lg object-cover" alt="" /></td>
                      <td className="p-3 font-bold text-white">{p.title}</td>
                      <td className="p-3 text-slate-400">{p.store}</td>
                      <td className="p-3 text-emerald-400 font-bold">{p.price} ر.ع</td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDeleteProduct(p._id || p.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition">
                          <Trash2 size={15} />
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
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black">إدارة وتحديث حالات الطلبات ({orders.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">المحتوى</th>
                    <th className="p-3">المشتري</th>
                    <th className="p-3">المتجر</th>
                    <th className="p-3">الإجمالي</th>
                    <th className="p-3 text-center">تغيير الحالة وحفظها</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-bold text-white truncate max-w-[180px]">{o.productName}</td>
                      <td className="p-3 text-slate-400">{o.buyerName}</td>
                      <td className="p-3 text-slate-300">{o.store}</td>
                      <td className="p-3 text-emerald-400 font-bold">{o.totalPrice || o.price} ر.ع</td>
                      <td className="p-3 text-center">
                        <select
                          value={o.status || 'New'}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="bg-black/60 border border-white/20 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold outline-none cursor-pointer"
                        >
                          <option value="New">جديد (New)</option>
                          <option value="Accepted">مقبول (Accepted)</option>
                          <option value="Preparing">قيد التجهيز (Preparing)</option>
                          <option value="Ready">جاهز (Ready)</option>
                          <option value="Completed">مكتمل (Completed)</option>
                          <option value="Cancelled">ملغى (Cancelled)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. التقارير */}
        {activeTab === 'reports' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 animate-in fade-in">
            <h2 className="text-lg font-black">التقارير المالية والتشغيلية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">المبيعات الكلية</span>
                <h4 className="text-2xl font-black text-white">{stats.totalSales} ر.ع</h4>
              </div>
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">رسوم المنصة 5% المحصلة</span>
                <h4 className="text-2xl font-black text-emerald-400">+{stats.totalPlatformFees} ر.ع</h4>
              </div>
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block mb-1">عدد الطلبات المنجزة</span>
                <h4 className="text-2xl font-black text-sky-400">{orders.length} طلب</h4>
              </div>
            </div>
          </div>
        )}

        {/* 7. الإشعارات */}
        {activeTab === 'notifications' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black">إشعارات النظام ({notifications.length})</h2>
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n._id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex justify-between items-center gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-white">{n.title}</h4>
                    <p className="text-xs text-slate-400">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. المحتوى والإعلانات (مفعّل بالكامل ومتصل بـ MongoDB) */}
        {activeTab === 'content' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles size={20} className="text-sky-400" />
                <span>إدارة بنرات وإعلانات الصفحة الرئيسية</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                أي إعلان تضيفه هنا يُحفظ مباشرة في قاعدة بيانات MongoDB ويظهر فوراً في شريط التمرير للطلاب والمشترين.
              </p>
            </div>

            {/* معاينة حية للإعلان (Live Preview) */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-400 block">معاينة شكل الإعلان الحقيقي على الموقع:</span>
              <div className={`relative w-full h-[200px] sm:h-[240px] rounded-3xl overflow-hidden shadow-xl flex items-center justify-between px-6 sm:px-12 bg-gradient-to-r ${newBanner.bgColor} transition-all duration-300 border border-white/10`}>
                <div className="text-white max-w-lg z-20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      {newBanner.badge || 'عرض خاص'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-black leading-tight">
                    {newBanner.title || 'اكتب عنوان الإعلان ليظهر هنا...'}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90">
                    {newBanner.subtitle || 'اكتب الوصف الترويجي أو تفاصيل العرض هنا...'}
                  </p>
                  <button type="button" className="mt-2 bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-xs shadow-md">
                    {newBanner.buttonText || 'تسوق الآن'}
                  </button>
                </div>

                {newBanner.image ? (
                  <div className="absolute left-0 top-0 w-1/2 h-full rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto opacity-40 mix-blend-overlay">
                    <img src={newBanner.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20 hidden sm:block">
                    <ImageIcon size={90} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* نموذج إضافة إعلان جديد */}
            <form onSubmit={handleAddBanner} className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-sky-400 flex items-center gap-1.5">
                <Plus size={16} />
                <span>إضافة إعلان جديد إلى الصفحة الرئيسية</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">عنوان الإعلان *</label>
                  <input
                    required
                    placeholder="مثال: عروض بداية الفصل الدراسي"
                    value={newBanner.title}
                    onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">الوصف الفرعي</label>
                  <input
                    placeholder="مثال: خصم حتى 30% على المستلزمات الهندسية"
                    value={newBanner.subtitle}
                    onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">رابط صورة الخلفية (URL) *</label>
                  <input
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newBanner.image}
                    onChange={e => setNewBanner({ ...newBanner, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">شارة الإعلان الصغيرة</label>
                  <input
                    placeholder="مثال: حصري، لفترة محدودة، عرض 50%"
                    value={newBanner.badge}
                    onChange={e => setNewBanner({ ...newBanner, badge: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">نص زر التوجيه</label>
                  <input
                    placeholder="مثال: تسوق الآن، استكشف المنتجات"
                    value={newBanner.buttonText}
                    onChange={e => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">نمط ولون التدرج الخلفي</label>
                  <select
                    value={newBanner.bgColor}
                    onChange={e => setNewBanner({ ...newBanner, bgColor: e.target.value })}
                    className="w-full bg-[#1e293b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none text-white cursor-pointer"
                  >
                    {gradientOptions.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md"
              >
                <Save size={16} />
                <span>حفظ ونشر الإعلان في قاعدة البيانات</span>
              </button>
            </form>

            {/* قائمة الإعلانات الحالية في قاعدة البيانات */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-300">
                  الإعلانات المنشورة في قاعدة البيانات ({banners.length})
                </h3>
                <span className="text-[11px] text-slate-400">تظهر هذه الإعلانات بالتناوب في سلايدر الصفحة الرئيسية</span>
              </div>

              {banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((b) => (
                    <div key={b._id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img src={b.image} alt="" className="w-20 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                        <div className="min-w-0">
                          <span className="bg-blue-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                            {b.badge || 'إعلان'}
                          </span>
                          <h4 className="font-bold text-xs text-white truncate">{b.title}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{b.subtitle || '—'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteBanner(b._id)}
                        className="p-2.5 text-rose-400 hover:bg-rose-500/20 rounded-xl transition shrink-0"
                        title="حذف هذا الإعلان من الصفحة الرئيسية"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/20 border border-dashed border-white/10 rounded-2xl text-xs text-slate-400">
                  لا توجد إعلانات إضافية مضافة بعد في قاعدة البيانات. استخدم النموذج أعلاه لإنشاء أول إعلان حقيقي.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. إعدادات النظام */}
        {activeTab === 'settings' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black">إعدادات المنصة وقاعدة البيانات</h2>
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نسبة رسوم المنصة الرسمية (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={systemSettings.platformFee}
                  onChange={e => setSystemSettings({ ...systemSettings, platformFee: parseFloat(e.target.value) })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#1877F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني المعتمد للمشرف</label>
                <input
                  type="email"
                  required
                  value={systemSettings.adminEmail}
                  onChange={e => setSystemSettings({ ...systemSettings, adminEmail: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#1877F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">سياسة ومواقع الاستلام والتوصيل</label>
                <input
                  required
                  value={systemSettings.deliveryPolicy}
                  onChange={e => setSystemSettings({ ...systemSettings, deliveryPolicy: e.target.value })}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#1877F2]"
                />
              </div>

              <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2">
                <Save size={16} />
                <span>حفظ التعديلات في MongoDB</span>
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}