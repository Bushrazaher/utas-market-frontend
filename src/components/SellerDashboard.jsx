import React, { useState, useEffect } from 'react';
import { 
  Store, Package, ShoppingCart, Settings, Plus, 
  Upload, CheckCircle2, ArrowRight, Trash2, RefreshCw, 
  DollarSign, TrendingUp, Phone, Clock, MapPin, Eye, AlertCircle
} from 'lucide-react';
import { API_URL } from '../config';

export default function SellerDashboard({ currentUser, setCurrentUser, setCurrentView, onBack }) {
  const [activeTab, setActiveTab] = useState('profile'); // profile, products, orders, stats
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. حالة بيانات المتجر والشعار
  const [storeData, setStoreData] = useState({
    storeName: currentUser?.storeName || '',
    storeDesc: currentUser?.storeDesc || '',
    mainCategory: currentUser?.mainCategory || 'Food & Beverage',
    storePhone: currentUser?.storePhone || '',
    whatsapp: currentUser?.whatsapp || '',
    instagram: currentUser?.instagram || '',
    workingHours: currentUser?.workingHours || '8:00 AM - 4:00 PM',
    pickupLocation: currentUser?.pickupLocation || 'كلية الهندسة - المدخل الرئيسي',
    storeLogo: currentUser?.storeLogo || '',
    storeBanner: currentUser?.storeBanner || ''
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // حالة إضافة منتج جديد
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'مأكولات ومشروبات',
    desc: '',
    image: '',
    stock: 10
  });

  const getHeaders = () => {
    const token = localStorage.getItem('utas_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 3500);
    } else {
      setFeedbackMsg(msg);
      setTimeout(() => setFeedbackMsg(''), 3500);
    }
  };

  // جلب المنتجات والطلبات الخاصة بهذا المتجر
  const fetchSellerData = async () => {
    setIsLoading(true);
    const headers = getHeaders();
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch(`${API_URL}/api/products?store=${encodeURIComponent(currentUser?.storeName || '')}`),
        fetch(`${API_URL}/api/orders`, { headers })
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, [currentUser?.storeName]);

  // دالة تحويل صورة اللوجو إلى Base64 ومعاينتها
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت', true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setStoreData(prev => ({ ...prev, storeLogo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // دالة تحويل صورة المنتج
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // حفظ شعار وبيانات المتجر في MongoDB
  const handleSaveStoreProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setFeedbackMsg('');

    try {
      const res = await fetch(`${API_URL}/api/seller/setup-store`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(storeData)
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.error || 'تعذر حفظ بيانات المتجر', true);
        return;
      }

      // تحديث حالة المستخدم في الواجهة وفي LocalStorage
      const updatedUser = { ...currentUser, ...data.user };
      if (setCurrentUser) setCurrentUser(updatedUser);
      localStorage.setItem('utas_user', JSON.stringify(updatedUser));

      showNotification('✅ تم حفظ شعار المتجر والبيانات بنجاح في قاعدة البيانات!');
    } catch (err) {
      showNotification('تعذر الاتصال بالخادم، تأكد من تشغيل السيرفر', true);
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة منتج جديد
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      showNotification('يرجى كتابة اسم المنتج وسعره', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          store: storeData.storeName || currentUser?.storeName || 'متجري'
        })
      });

      if (res.ok) {
        showNotification('✅ تم حفظ المنتج في متجرك بنجاح!');
        setNewProduct({ title: '', price: '', category: 'مأكولات ومشروبات', desc: '', image: '', stock: 10 });
        fetchSellerData();
      } else {
        showNotification('تعذر حفظ المنتج', true);
      }
    } catch {
      showNotification('خطأ في الاتصال بالخادم', true);
    }
  };

  // تغيير حالة الطلب وحفظها
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showNotification(`✅ تم تحديث حالة الطلب إلى "${newStatus}".`);
        fetchSellerData();
      }
    } catch {
      showNotification('تعذر تحديث الطلب', true);
    }
  };

  const totalEarnings = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col" dir="rtl">
      
      {/* رأس الصفحة */}
      <header className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden">
            {storeData.storeLogo ? (
              <img src={storeData.storeLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="text-[#1877F2]" size={24} />
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{storeData.storeName || 'لوحة تحكم التاجر'}</h1>
            <p className="text-xs text-slate-400">إدارة متجرك، المنتجات، والطلبات الواردة مباشرة</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchSellerData} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>تحديث</span>
          </button>
          <button onClick={() => setCurrentView('home')} className="px-4 py-2.5 bg-[#1877F2] hover:bg-blue-600 rounded-xl text-xs font-bold text-white transition flex items-center gap-2">
            <ArrowRight size={15} className="rtl:rotate-180" />
            <span>الرئيسية</span>
          </button>
        </div>
      </header>

      {/* شريط التبويبات */}
      <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-white/10 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'profile' ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 text-slate-300'}`}
        >
          <Store size={16} />
          <span>هوية وشعار المتجر</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'products' ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 text-slate-300'}`}
        >
          <Package size={16} />
          <span>منتجات المتجر ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'orders' ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 text-slate-300'}`}
        >
          <ShoppingCart size={16} />
          <span>الطلبات الواردة ({orders.length})</span>
        </button>
      </div>

      {/* التنبيهات */}
      {feedbackMsg && (
        <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mx-6 mt-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* محتوى اللوحة */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 1. تبويب هوية وشعار المتجر (رفع وحفظ في MongoDB) */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-white">إعدادات هوية وشعار المتجر</h2>
              <p className="text-xs text-slate-400 mt-0.5">قم برفع شعار متجرك وبيانات التواصل لتظهر للطلاب والمشترين في المتجر.</p>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-6">
              
              {/* قسم رفع ومعاينة الشعار */}
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center shadow-lg">
                    {storeData.storeLogo ? (
                      <img src={storeData.storeLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Store className="text-slate-400" size={36} />
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer rounded-2xl transition duration-200">
                    <Upload size={20} className="text-white mb-1" />
                    <span className="text-[10px] text-white font-bold">تغيير الشعار</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>

                <div className="space-y-1.5 text-center sm:text-right">
                  <h4 className="font-bold text-sm text-white">شعار المتجر الرسمي (Store Logo)</h4>
                  <p className="text-xs text-slate-400">ينصح باستخدام صورة مربعة (PNG أو JPG) واضحة المعالم.</p>
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-sky-400 cursor-pointer transition">
                    <Upload size={14} />
                    <span>اختر ملف الشعار من جهازك</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* باقي حقول المتجر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر *</label>
                  <input
                    required
                    value={storeData.storeName}
                    onChange={e => setStoreData({ ...storeData, storeName: e.target.value })}
                    placeholder="مثال: Tech Student"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">التصنيف الرئيسي *</label>
                  <select
                    value={storeData.mainCategory}
                    onChange={e => setStoreData({ ...storeData, mainCategory: e.target.value })}
                    className="w-full bg-[#1e293b] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none text-white cursor-pointer"
                  >
                    <option value="Food & Beverage">مأكولات ومشروبات (Food & Beverage)</option>
                    <option value="Fashion">أزياء وملابس (Fashion)</option>
                    <option value="Accessories & Gifts">إكسسوارات وهدايا (Accessories & Gifts)</option>
                    <option value="Services">خدمات طلابية وبرمجية (Services)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب للتواصل *</label>
                  <input
                    required
                    value={storeData.storePhone}
                    onChange={e => setStoreData({ ...storeData, storePhone: e.target.value })}
                    placeholder="968xxxxxxx"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">مكان ونقطة الاستلام في الحرم الجامعي</label>
                  <input
                    value={storeData.pickupLocation}
                    onChange={e => setStoreData({ ...storeData, pickupLocation: e.target.value })}
                    placeholder="مثال: كلية الهندسة - استراحة الطلاب"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">نبذة ووصف المتجر</label>
                  <textarea
                    rows={3}
                    value={storeData.storeDesc}
                    onChange={e => setStoreData({ ...storeData, storeDesc: e.target.value })}
                    placeholder="اكتب نبذة تصف منتجاتك وخدماتك للطلاب..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#1877F2] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-lg"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                <span>حفظ الشعار والبيانات في قاعدة البيانات</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. تبويب المنتجات */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            {/* إضافة منتج جديد */}
            <form onSubmit={handleAddProduct} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Plus size={16} className="text-sky-400" />
                <span>إضافة منتج جديد للمتجر</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  required
                  placeholder="اسم المنتج *"
                  value={newProduct.title}
                  onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#1877F2]"
                />
                <input
                  required
                  type="number"
                  step="0.1"
                  placeholder="السعر (ر.ع) *"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#1877F2]"
                />
                <input
                  type="number"
                  placeholder="الكمية المتوفرة (المخزون)"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#1877F2]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 bg-black/40 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#1877F2] transition text-xs text-slate-300">
                  <Upload size={16} />
                  <span>{newProduct.image ? 'تم اختيار صورة المنتج بنجاح' : 'اختر صورة للمنتج من جهازك'}</span>
                  <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                </label>
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">
                  نشر المنتج
                </button>
              </div>
            </form>

            {/* قائمة المنتجات المعروضة */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <div key={p._id || p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div className="aspect-square rounded-xl bg-black/40 overflow-hidden border border-white/10">
                    <img src={p.image || 'https://placehold.co/200'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{p.title}</h4>
                    <span className="text-xs font-black text-emerald-400 mt-1 block">{p.price} ر.ع</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. تبويب الطلبات الواردة */}
        {activeTab === 'orders' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-in fade-in">
            <h2 className="text-lg font-black text-white">الطلبات الواردة للمتجر ({orders.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">المنتجات</th>
                    <th className="p-3">المشتري</th>
                    <th className="p-3">الهاتف</th>
                    <th className="p-3">الإجمالي</th>
                    <th className="p-3 text-center">تحديث الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-bold text-white">{o.productName}</td>
                      <td className="p-3 text-slate-400">{o.buyerName}</td>
                      <td className="p-3 font-mono text-slate-300">{o.buyerPhone}</td>
                      <td className="p-3 text-emerald-400 font-bold">{o.totalPrice || o.price} ر.ع</td>
                      <td className="p-3 text-center">
                        <select
                          value={o.status || 'New'}
                          onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="bg-black/60 border border-white/20 text-white rounded-lg px-2 py-1 text-[11px] font-bold outline-none cursor-pointer"
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

      </main>
    </div>
  );
}