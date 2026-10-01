import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Save, 
  TrendingUp,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { API_URL } from '../config';

export default function SellerDashboard({ 
  currentUser, 
  setCurrentUser, 
  setCurrentView, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, settings
  const [storeData, setStoreData] = useState({
    storeName: '',
    storeDesc: '',
    category: 'خدمات طلابية',
    whatsapp: '',
    instagram: '',
    workingHours: '',
    location: '',
    storeLogo: '',
    storeBanner: ''
  });
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // نموذج إضافة منتج جديد
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'خدمات طلابية',
    desc: '',
    image: '',
    tag: 'جديد'
  });

  const fetchSellerData = async () => {
    if (!currentUser?.email) return;
    setIsLoading(true);
    try {
      const userRes = await fetch(`${API_URL}/api/auth/profile/${currentUser.email}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setStoreData({
          storeName: userData.storeName || '',
          storeDesc: userData.storeDesc || '',
          category: userData.category || 'خدمات طلابية',
          whatsapp: userData.whatsapp || '',
          instagram: userData.instagram || '',
          workingHours: userData.workingHours || '',
          location: userData.location || '',
          storeLogo: userData.storeLogo || '',
          storeBanner: userData.storeBanner || ''
        });
      }

      const [prodRes, ordRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/orders`)
      ]);

      if (prodRes.ok) {
        const allProds = await prodRes.json();
        const myProds = allProds.filter(p => 
          (p.sellerEmail && p.sellerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (p.store && storeData.storeName && p.store.toLowerCase() === storeData.storeName.toLowerCase())
        );
        setProducts(myProds.reverse());
      }

      if (ordRes.ok) {
        const allOrders = await ordRes.json();
        const myOrders = allOrders.filter(o => 
          o.store && storeData.storeName && o.store.toLowerCase() === storeData.storeName.toLowerCase()
        );
        setOrders(myOrders.reverse());
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, [currentUser?.email]);

  // دالة تحويل الصورة المرفوعة من الجهاز إلى Base64
  const handleImageUpload = (e, fieldName, isStoreField = true) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isStoreField) {
        setStoreData(prev => ({ ...prev, [fieldName]: reader.result }));
      } else {
        setNewProduct(prev => ({ ...prev, [fieldName]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // حفظ إعدادات المتجر (الاسم، المحتوى، واللوجو)
  const handleSaveStore = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/stores/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, ...storeData })
      });
      if (res.ok) {
        setFeedback(isEn ? 'Store settings saved successfully!' : 'تم حفظ اسم المتجر، المحتوى، واللوجو بنجاح!');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  // إضافة منتج جديد مع صورة مرفوعة
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;

    const productPayload = {
      ...newProduct,
      store: storeData.storeName || currentUser.name,
      sellerEmail: currentUser.email
    };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });
      if (res.ok) {
        setFeedback(isEn ? 'Product added successfully!' : 'تم إضافة المنتج بنجاح!');
        setNewProduct({ title: '', price: '', category: 'خدمات طلابية', desc: '', image: '', tag: 'جديد' });
        fetchSellerData();
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch {
      alert('تعذر إضافة المنتج');
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        setFeedback('تم حذف المنتج بنجاح.');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch {
      alert('خطأ أثناء الحذف');
    }
  };

  // تغيير حالة الطلب
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        setFeedback('تم تحديث حالة الطلب بنجاح.');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (Number(o.subtotal || o.totalPrice) || 0), 0);

  return (
    <div className={`max-w-6xl mx-auto py-6 space-y-6`} dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* رأس لوحة تحكم التاجر */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
            {storeData.storeLogo ? (
              <img src={storeData.storeLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Store size={28} className="text-[#1493d8]" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {storeData.storeName || (isEn ? 'Seller Studio' : 'استوديو التاجر')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser?.email} | لوحة تحكم متجرك الطلابي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
          >
            الرئيسية
          </button>
          <button
            onClick={fetchSellerData}
            className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl transition"
            title="تحديث البيانات"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* أزرار التنقل بين الأقسام */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: <TrendingUp size={16} /> },
          { id: 'products', label: 'إدارة المنتجات', icon: <Package size={16} />, badge: products.length },
          { id: 'orders', label: 'إدارة الطلبات', icon: <ShoppingCart size={16} />, badge: orders.length },
          { id: 'settings', label: 'إعدادات وتعديل المتجر', icon: <Store size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition shadow-xs ${
              activeTab === tab.id 
                ? 'bg-black text-white dark:bg-slate-100 dark:text-slate-900' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1493d8]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="bg-[#1493d8] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 1. نظرة عامة */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <p className="text-xs font-bold text-slate-500 mb-1">إجمالي المبيعات</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalSales.toFixed(3)} OMR</h3>
              <span className="text-[10px] text-emerald-500 font-bold mt-1 block">أرباح متجرك</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <p className="text-xs font-bold text-slate-500 mb-1">إجمالي الطلبات</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</h3>
              <span className="text-[10px] text-blue-500 font-bold mt-1 block">عبر المنصة</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <p className="text-xs font-bold text-slate-500 mb-1">عدد المنتجات</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{products.length}</h3>
              <span className="text-[10px] text-purple-500 font-bold mt-1 block">معروضة للطلاب</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <p className="text-xs font-bold text-slate-500 mb-1">حالة المتجر</p>
              <h3 className="text-xl font-black text-emerald-600">نشط ومعتمد</h3>
              <span className="text-[10px] text-slate-400 mt-1 block">جاهز لاستقبال الطلبات</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. إدارة المنتجات مع رفع الصور */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={18} className="text-[#1493d8]" />
              <span>إضافة منتج أو خدمة جديدة</span>
            </h3>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="مثال: ملخص مادة البرمجة المرئية"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">السعر (OMR) *</label>
                <input
                  type="text"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="مثال: 3.500 OMR"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التصنيف *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                >
                  <option value="خدمات طلابية">خدمات طلابية</option>
                  <option value="كتب ومذكرات">كتب ومذكرات</option>
                  <option value="مأكولات ومشروبات">مأكولات ومشروبات</option>
                  <option value="إلكترونيات وأدوات">إلكترونيات وأدوات</option>
                  <option value="أزياء وإكسسوارات">أزياء وإكسسوارات</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">صورة المنتج (رفع من الجهاز)</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 transition text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Upload size={16} />
                    <span>{newProduct.image ? 'تم اختيار صورة المنتج ✅' : 'اختر صورة من جهازك...'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'image', false)} 
                      className="hidden" 
                    />
                  </label>
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وسم مميز</label>
                <input
                  type="text"
                  value={newProduct.tag}
                  onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                  placeholder="الأكثر مبيعاً / جديد"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وصف المنتج التفصيلي</label>
                <textarea
                  rows="2"
                  value={newProduct.desc}
                  onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                  placeholder="اكتب تفاصيل المنتج..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                ></textarea>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  نشر المنتج في المتجر
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-black text-slate-900 dark:text-white">منتجات متجري ({products.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4">الصورة</th>
                    <th className="p-4">اسم المنتج</th>
                    <th className="p-4">التصنيف</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {products.map(p => (
                    <tr key={p._id || p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4">
                        <img src={p.image || 'https://via.placeholder.com/50'} alt="" className="w-10 h-10 rounded-lg object-cover border" />
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{p.title}</td>
                      <td className="p-4 text-slate-500">{p.category}</td>
                      <td className="p-4 font-black">{p.price}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteProduct(p._id || p.id)}
                          className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. إدارة الطلبات */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-base font-black text-slate-900 dark:text-white">طلبات العملاء الواردة ({orders.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">المنتجات</th>
                  <th className="p-4">المشتري والهاتف</th>
                  <th className="p-4">الإجمالي</th>
                  <th className="p-4">الحالة الحالية</th>
                  <th className="p-4 text-center">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orders.map(o => (
                  <tr key={o._id || o.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="p-4 font-bold">#{o._id ? o._id.slice(-5) : '1024'}</td>
                    <td className="p-4 font-bold max-w-[200px] truncate">{o.productName}</td>
                    <td className="p-4 text-slate-500">{o.buyerName} <br/> <span className="font-mono text-[10px]">{o.buyerPhone}</span></td>
                    <td className="p-4 font-black">{o.totalPrice || o.price || 0} OMR</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {o.status || 'New (جديد)'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={o.status || 'New'}
                        onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-[11px] font-bold outline-none"
                      >
                        <option value="New">New (جديد)</option>
                        <option value="Accepted">Accepted (مقبول)</option>
                        <option value="Preparing">Preparing (قيد التجهيز)</option>
                        <option value="Ready">Ready (جاهز للاستلام)</option>
                        <option value="Completed">Completed (مكتمل)</option>
                        <option value="Cancelled">Cancelled (ملغي)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. إعدادات المتجر: تعديل الاسم، المحتوى، واللوجو بالرفع المباشر */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">تعديل اسم المتجر، المحتوى، واللوجو</h3>

          <form onSubmit={handleSaveStore} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المتجر *</label>
                <input
                  type="text"
                  required
                  value={storeData.storeName}
                  onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التصنيف الرئيسي *</label>
                <select
                  value={storeData.category}
                  onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                >
                  <option value="Food & Beverage">Food & Beverage (مأكولات ومشروبات)</option>
                  <option value="Fashion">Fashion (أزياء وملابس)</option>
                  <option value="Accessories & Gifts">Accessories & Gifts (إكسسوارات وهدايا)</option>
                  <option value="Services">Services (خدمات وبرمجة)</option>
                </select>
              </div>

              {/* رفع لوجو المتجر مباشرة من الجهاز */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">لوجو المتجر (رفع صورة)</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 transition text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Upload size={15} />
                    <span>{storeData.storeLogo ? 'تم تغيير اللوجو ✅' : 'اختر لوجو المتجر...'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'storeLogo', true)} 
                      className="hidden" 
                    />
                  </label>
                  {storeData.storeLogo && (
                    <img src={storeData.storeLogo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border" />
                  )}
                </div>
              </div>

              {/* رفع غلاف المتجر مباشرة من الجهاز */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">صورة الغلاف Banner (رفع صورة)</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 transition text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Upload size={15} />
                    <span>{storeData.storeBanner ? 'تم تغيير الغلاف ✅' : 'اختر صورة الغلاف...'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'storeBanner', true)} 
                      className="hidden" 
                    />
                  </label>
                  {storeData.storeBanner && (
                    <img src={storeData.storeBanner} alt="Banner" className="w-10 h-10 rounded-xl object-cover border" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم واتساب المتجر</label>
                <input
                  type="text"
                  value={storeData.whatsapp}
                  onChange={(e) => setStoreData({ ...storeData, whatsapp: e.target.value })}
                  placeholder="9689xxxxxxx"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">حساب إنستغرام</label>
                <input
                  type="text"
                  value={storeData.instagram}
                  onChange={(e) => setStoreData({ ...storeData, instagram: e.target.value })}
                  placeholder="username"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">محتوى ووصف المتجر</label>
                <textarea
                  rows="3"
                  value={storeData.storeDesc}
                  onChange={(e) => setStoreData({ ...storeData, storeDesc: e.target.value })}
                  placeholder="اكتب نبذة تعريفية عن متجرك ومحتواه..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-[#1493d8]"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#1493d8] hover:bg-[#117bb5] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Save size={16} />
                <span>حفظ التعديلات (الاسم، المحتوى، واللوجو)</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}