import React, { useState, useEffect } from 'react';
import { 
  Store, 
  PlusCircle, 
  Package, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  UploadCloud,
  DollarSign
} from 'lucide-react';
import { API_URL } from '../config';

export default function SellerDashboard({ currentUser, setCurrentUser, setCurrentView, language = 'ar', theme = 'light' }) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  // بيانات نموذج إعداد المتجر
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');

  // بيانات المنتجات
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // بيانات إضافة منتج جديد
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('notes');
  const [image, setImage] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  // التحقق من حالة المتجر الحالية
  const isApproved = currentUser?.isStoreConfigured || currentUser?.storeStatus === 'approved';
  const isPending = currentUser?.storeStatus === 'pending';

  // جلب منتجات هذا التاجر فقط
  const fetchMyProducts = async () => {
    if (!currentUser?.email) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        // تصفية المنتجات الخاصة بهذا التاجر
        const filtered = data.filter(p => p.sellerEmail?.toLowerCase() === currentUser.email.toLowerCase());
        setMyProducts(filtered);
      }
    } catch (err) {
      console.error('تعذر جلب المنتجات:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isApproved) {
      fetchMyProducts();
    }
  }, [isApproved, currentUser?.email]);

  // دالة إرسال طلب إعداد المتجر
  const handleSetupStore = async (e) => {
    e.preventDefault();
    if (!storeName || !storePhone) {
      setSetupError(isEn ? 'Please fill in required fields.' : 'يرجى إدخال اسم المتجر ورقم الهاتف.');
      return;
    }

    setSetupLoading(true);
    setSetupError('');

    try {
      const res = await fetch(`${API_URL}/api/seller/setup-store`, {
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

      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال طلب المتجر');
      }

      // تحديث حالة المستخدم في الجلسة والمتصفح
      const updatedUser = {
        ...currentUser,
        storeName: data.user.storeName,
        storeStatus: data.user.storeStatus || 'pending',
        isStoreConfigured: data.user.isStoreConfigured || false
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('utas_user', JSON.stringify(updatedUser));

    } catch (err) {
      setSetupError(err.message || 'تعذر الاتصال بالسيرفر');
    } finally {
      setSetupLoading(false);
    }
  };

  // دالة إضافة منتج جديد للمتجر المعتمد
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!title || !price) return;

    setAddingProduct(true);
    try {
      const newProductData = {
        title,
        price: `${parseFloat(price).toFixed(3)} ر.ع`,
        category,
        image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
        store: currentUser.storeName || 'متجري الجامعي',
        sellerEmail: currentUser.email.toLowerCase()
      };

      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductData)
      });

      if (res.ok) {
        setTitle('');
        setPrice('');
        setImage('');
        fetchMyProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingProduct(false);
    }
  };

  // دالة حذف منتج
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(isEn ? 'Are you sure you want to delete this product?' : 'هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMyProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================================
  // الحالة 1: الطلب قيد المراجعة والاعتماد من الإدارة الجامعية (Pending Screen)
  // =========================================================================
  if (isPending && !isApproved) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center animate-bounce">
          <Clock size={40} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black">
            {isEn ? 'Store Request Under Review' : 'طلب المتجر قيد المراجعة والاعتماد'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isEn 
              ? `Your store "${currentUser.storeName}" has been submitted. The campus administration is reviewing your request.`
              : `تم استلام بيانات متجرك "${currentUser.storeName}" بنجاح، وتم إرسال طلب الاعتماد إلى الإدارة الجامعية للموافقة عليه.`}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border text-xs font-bold ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <span>{isEn ? 'You can start adding products immediately once approved via Admin Email.' : 'ستتمكن من رفع المنتجات وتحديد الأسعار فور صدور الموافقة.'}</span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="tactile-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black text-white hover:bg-slate-800 text-xs font-bold transition shadow-sm"
        >
          <RefreshCw size={14} />
          <span>{isEn ? 'Refresh Status' : 'تحديث حالة المتجر'}</span>
        </button>
      </div>
    );
  }

  // =========================================================================
  // الحالة 2: المتجر معتمد وجاهز للبيع (Seller Dashboard & Products Manager)
  // =========================================================================
  if (isApproved) {
    return (
      <div className="max-w-6xl mx-auto py-4 space-y-8" dir={isEn ? 'ltr' : 'rtl'}>
        {/* ترويسة المتجر */}
        <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1493d8]/10 text-[#1493d8] flex items-center justify-center font-black">
              <Store size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">{currentUser.storeName}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>{isEn ? 'Verified' : 'معتمد'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {myProducts.length} {isEn ? 'Active Products' : 'منتجات معروضة'}
          </span>
        </div>

        {/* نموذج إضافة منتج جديد */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h2 className="text-sm font-black flex items-center gap-2">
            <PlusCircle size={18} className="text-[#1493d8]" />
            <span>{isEn ? 'Add New Product to Store' : 'إضافة منتج جديد للمتجر'}</span>
          </h2>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {isEn ? 'Product Title *' : 'اسم المنتج أو الخدمة *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isEn ? 'e.g., IT Project Source' : 'مثال: ملخص هندسة البرمجيات'}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {isEn ? 'Price (OMR) *' : 'السعر (ر.ع) *'}
              </label>
              <input
                type="number"
                step="0.100"
                min="0.100"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2.500"
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {isEn ? 'Category' : 'التصنيف'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="notes">{isEn ? 'Academic Notes' : 'مذكرات دراسية'}</option>
                <option value="projects">{isEn ? 'Graduation Projects' : 'مشاريع تخرج'}</option>
                <option value="food">{isEn ? 'Food & Sweets' : 'أطعمة وحلويات'}</option>
                <option value="services">{isEn ? 'Student Services' : 'خدمات طلابية'}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={addingProduct}
                className="w-full bg-[#1493d8] hover:bg-[#117bb5] text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PlusCircle size={15} />
                <span>{addingProduct ? (isEn ? 'Adding...' : 'جاري الإضافة...') : (isEn ? 'Upload Product' : 'حفظ ونشر المنتج')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* قائمة منتجات المتجر الحالية */}
        <div className="space-y-3">
          <h2 className="text-sm font-black flex items-center gap-2">
            <Package size={18} className="text-[#1493d8]" />
            <span>{isEn ? 'Store Inventory' : 'المنتجات المعروضة في المتجر'}</span>
          </h2>

          {loadingProducts ? (
            <div className="text-center py-12 text-xs text-slate-400 font-bold">{isEn ? 'Loading products...' : 'جاري تحميل المنتجات...'}</div>
          ) : myProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myProducts.map((prod) => (
                <div 
                  key={prod._id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="text-xs font-black line-clamp-1">{prod.title}</h3>
                    <span className="text-[11px] font-bold text-[#1493d8] block">{prod.price}</span>
                    <span className="text-[10px] text-slate-400">{prod.category}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(prod._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title={isEn ? 'Delete product' : 'حذف المنتج'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-3xl border border-dashed text-xs font-bold text-slate-400 ${
              isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'
            }`}>
              {isEn ? 'No products added yet. Use the form above to add your first product.' : 'لم تقم بإضافة أي منتجات حتى الآن. استخدم النموذج أعلاه لإضافة منتجك الأول.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // الحالة 3: التاجر لم يقم بتهيئة المتجر بعد (نموذج التسجيل الظاهر بالصورة)
  // =========================================================================
  return (
    <div className="max-w-md mx-auto py-8 px-4" dir={isEn ? 'ltr' : 'rtl'}>
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-[#1493d8] flex items-center justify-center shadow-xs">
            <Store size={28} />
          </div>
          <h1 className="text-xl font-black">
            {isEn ? 'Register Campus Store' : 'تسجيل المتجر الطلابي'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEn ? 'Enter your store details and phone number to start selling.' : 'يرجى تعبئة بيانات متجرك ورقم هاتفك للبدء واستلام إشعارات الشراء.'}
          </p>
        </div>

        {setupError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold">
            <AlertCircle size={15} />
            <span>{setupError}</span>
          </div>
        )}

        <form onSubmit={handleSetupStore} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              {isEn ? 'Store Name *' : 'اسم المتجر *'}
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="ENG PROJECTS"
              className={`w-full border rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#1493d8] transition ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              {isEn ? 'Business Description' : 'وصف النشاط'}
            </label>
            <textarea
              rows={3}
              value={storeDesc}
              onChange={(e) => setStoreDesc(e.target.value)}
              placeholder={isEn ? 'Describe your services or products...' : 'متجرنا مختص بمساعدة الطلاب في انشاء مشاريع التخرج'}
              className={`w-full border rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#1493d8] transition resize-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              {isEn ? 'Contact Phone Number *' : 'رقم الهاتف للتواصل وإشعارات الطلب *'}
            </label>
            <input
              type="tel"
              required
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder="91416668"
              className={`w-full border rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#1493d8] transition ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={setupLoading}
            className="w-full bg-black hover:bg-slate-800 text-white font-black text-xs py-3 rounded-2xl transition shadow-md active:scale-98 disabled:opacity-50"
          >
            {setupLoading ? (isEn ? 'Saving...' : 'جاري الحفظ...') : (isEn ? 'Save and Start Selling' : 'حفظ وبدء البيع')}
          </button>
        </form>

      </div>
    </div>
  );
}