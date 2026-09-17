import React, { useState, useEffect } from 'react';
import { Store, Bell, PlusCircle, Trash2, PackageCheck, AlertCircle } from 'lucide-react';

export default function SellerDashboard({ currentUser, setCurrentUser }) {
  const [storeName, setStoreName] = useState(currentUser?.storeName || '');
  const [storeDesc, setStoreDesc] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('كتب ومذكرات');
  const [feedback, setFeedback] = useState('');

  const fetchSellerData = async () => {
    if (!currentUser?.email) return;

    // 1. جلب إشعارات التاجر
    try {
      const notifRes = await fetch(`http://localhost:5000/api/notifications/${currentUser.email}`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }
    } catch {}

    // 2. جلب منتجات هذا التاجر
    try {
      const prodRes = await fetch('http://localhost:5000/api/products');
      if (prodRes.ok) {
        const allProds = await prodRes.json();
        setMyProducts(allProds.filter(p => p.sellerEmail === currentUser.email));
      }
    } catch {}
  };

  useEffect(() => {
    fetchSellerData();
  }, [currentUser]);

  // تهيئة المتجر للتاجر الجديد
  const handleStoreSetup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/seller/setup-store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          storeName,
          storeDesc,
          storePhone
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(prev => ({ ...prev, isStoreConfigured: true, storeName }));
        localStorage.setItem('utas_user', JSON.stringify({ ...currentUser, isStoreConfigured: true, storeName }));
      }
    } catch {
      setFeedback('تعذر تهيئة المتجر حالياً.');
    }
  };

  // إضافة منتج جديد
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProd = {
      title,
      price: `${parseFloat(price).toFixed(3)} OMR`,
      category,
      store: currentUser.storeName || 'متجري الطلابي',
      sellerEmail: currentUser.email
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        setTitle('');
        setPrice('');
        fetchSellerData();
        setFeedback('تمت إضافة المنتج بنجاح.');
        setTimeout(() => setFeedback(''), 2500);
      }
    } catch {
      setFeedback('تعذر حفظ المنتج.');
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchSellerData();
    } catch {}
  };

  // شاشة التهيئة للمتجر الجديد
  if (!currentUser?.isStoreConfigured && !currentUser?.storeName) {
    return (
      <div className="max-w-md mx-auto py-12 px-4" dir="rtl">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl text-center">
          <Store size={36} className="text-[#1493d8] mx-auto mb-3" />
          <h2 className="text-lg font-black mb-1">تسجيل المتجر الطلابي</h2>
          <p className="text-xs text-slate-500 mb-5">
            يرجى تعبئة بيانات متجرك ورقم هاتفك للبدء واستلام إشعارات الشراء.
          </p>
          <form onSubmit={handleStoreSetup} className="space-y-3 text-right">
            <div>
              <label className="text-xs font-bold block mb-1">اسم المتجر *</label>
              <input
                required
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                placeholder="مثال: ركن الهندسة للمذكرات"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">وصف النشاط</label>
              <input
                value={storeDesc}
                onChange={e => setStoreDesc(e.target.value)}
                placeholder="مذكرات، أدوات، كوكيز..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">رقم الهاتف للتواصل وإشعارات الطلب *</label>
              <input
                required
                value={storePhone}
                onChange={e => setStorePhone(e.target.value)}
                placeholder="968xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white font-bold py-2.5 rounded-xl text-xs mt-2">
              حفظ وبدء البيع
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6" dir="rtl">
      
      {/* بطاقة التاجر */}
      <div className="bg-sky-50 border border-sky-100 p-6 rounded-3xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-md">تاجر معتمد</span>
          <h1 className="text-xl font-black mt-1 text-slate-900">{currentUser.storeName}</h1>
          <p className="text-xs text-slate-500">نسبة عمولة المنصة الثابتة: 5% من كل طلب مكتمل</p>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* إشعارات المشتريات الواردة للتاجر */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Bell size={16} className="text-emerald-500" />
            <span>طلبات الشراء الواردة لمتجرك</span>
          </h2>
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">لا توجد طلبات واردة حالياً.</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs">
                  <p className="font-bold text-emerald-900">{n.title}</p>
                  <p className="text-emerald-700 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* إضافة منتج جديد */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
            <PlusCircle size={16} className="text-[#1493d8]" />
            <span>إضافة منتج للبيع</span>
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold block mb-1">اسم المنتج</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: ملخص مادة الخوارزميات"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold block mb-1">السعر (OMR)</label>
              <input
                required
                type="number"
                step="0.100"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="مثال: 2.500"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold block mb-1">القسم</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none"
              >
                <option value="كتب ومذكرات">كتب ومذكرات</option>
                <option value="مأكولات ومشروبات">مأكولات ومشروبات</option>
                <option value="إلكترونيات وأدوات">إلكترونيات وأدوات</option>
                <option value="خدمات طلابية">خدمات طلابية</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-black text-white font-bold py-2 rounded-xl text-xs">
              إضافة للمتجر
            </button>
          </form>
        </div>

        {/* المنتجات الحالية للتاجر */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-xs font-bold text-slate-900 mb-3">منتجاتك المعروضة</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {myProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">لم تعرض أي منتج بعد.</p>
            ) : (
              myProducts.map(p => (
                <div key={p._id || p.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <div>
                    <span className="font-bold block">{p.title}</span>
                    <span className="text-emerald-600 font-extrabold">{p.price}</span>
                  </div>
                  <button onClick={() => handleDeleteProduct(p._id || p.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}