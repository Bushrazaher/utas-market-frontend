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
  Layers,
  Image as ImageIcon,
  Upload,
  X,
  Edit3,
  Check,
  Phone,
  FileText
} from 'lucide-react';
import { API_URL } from '../config';

export default function SellerDashboard({ 
  currentUser, 
  setCurrentUser, 
  onRefreshUser, 
  setCurrentView, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  // 1. بيانات تسجيل المتجر المبدئي (لأول مرة قبل القبول)
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');

  // 2. حالة نافذة تعديل المتجر المنبثقة (Modal)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStoreName, setEditStoreName] = useState(currentUser?.storeName || '');
  const [editStoreDesc, setEditStoreDesc] = useState(currentUser?.storeDesc || '');
  const [editStorePhone, setEditStorePhone] = useState(currentUser?.storePhone || '');
  const [editStoreLogo, setEditStoreLogo] = useState(currentUser?.storeLogo || '');
  const [savingStore, setSavingStore] = useState(false);

  // 3. منتجات المتجر
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // 4. التصنيفات التفاعلية
  const [categoriesList, setCategoriesList] = useState([
    { id: 'notes', nameAr: 'مذكرات دراسية', nameEn: 'Academic Notes' },
    { id: 'projects', nameAr: 'مشاريع تخرج', nameEn: 'Graduation Projects' },
    { id: 'food', nameAr: 'أطعمة وحلويات', nameEn: 'Food & Sweets' },
    { id: 'services', nameAr: 'خدمات طلابية', nameEn: 'Student Services' }
  ]);

  // حقول إضافة منتج جديد
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('notes');
  const [customCategory, setCustomCategory] = useState('');
  const [image, setImage] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  // فحص حالة المتجر
  const isApproved = currentUser?.isStoreConfigured || currentUser?.storeStatus === 'approved';
  const isPending = currentUser?.storeStatus === 'pending';

  // مزامنة بيانات التعديل مع المستخدم الحالي
  useEffect(() => {
    if (currentUser) {
      setEditStoreName(currentUser.storeName || '');
      setEditStoreDesc(currentUser.storeDesc || '');
      setEditStorePhone(currentUser.storePhone || '');
      setEditStoreLogo(currentUser.storeLogo || '');
    }
  }, [currentUser]);

  // فتح نافذة التعديل
  const handleOpenEditModal = () => {
    setEditStoreName(currentUser?.storeName || '');
    setEditStoreDesc(currentUser?.storeDesc || '');
    setEditStorePhone(currentUser?.storePhone || '');
    setEditStoreLogo(currentUser?.storeLogo || '');
    setIsEditModalOpen(true);
  };

  // رفع ملف لوجو المتجر وتحويله لـ Base64
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isEn ? 'Please select a valid image file.' : 'يرجى اختيار ملف صورة صالح.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert(isEn ? 'Logo size must be under 2MB.' : 'حجم الشعار يجب أن يكون أقل من 2 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditStoreLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // رفع صورة المنتج من جهاز المستخدم
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isEn ? 'Please select a valid image file.' : 'يرجى اختيار ملف صورة صالح.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert(isEn ? 'Image size must be under 2MB.' : 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // حفظ تعديلات المتجر مع ضمان عدم الرجوع لـ Pending
  const handleSaveStoreUpdates = async (e) => {
    if (e) e.preventDefault();
    if (!editStoreName.trim()) {
      alert(isEn ? 'Store name cannot be empty.' : 'اسم المتجر لا يمكن أن يكون فارغاً.');
      return;
    }

    setSavingStore(true);
    try {
      const res = await fetch(`${API_URL}/api/seller/setup-store`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          storeName: editStoreName,
          storeDesc: editStoreDesc,
          storePhone: editStorePhone,
          storeLogo: editStoreLogo,
          storeStatus: 'approved' // تثبيت الاعتماد
        })
      });

      const data = await res.json();
      if (res.ok) {
        const updatedUser = {
          ...currentUser,
          storeName: editStoreName,
          storeDesc: editStoreDesc,
          storePhone: editStorePhone,
          storeLogo: editStoreLogo,
          storeStatus: 'approved',
          isStoreConfigured: true
        };

        setCurrentUser(updatedUser);
        localStorage.setItem('utas_user', JSON.stringify(updatedUser));
        setIsEditModalOpen(false);
        if (onRefreshUser) onRefreshUser();
      } else {
        alert(data.error || (isEn ? 'Failed to update store.' : 'فشل تحديث بيانات المتجر.'));
      }
    } catch (err) {
      console.error(err);
      alert(isEn ? 'Connection error.' : 'تعذر الاتصال بالسيرفر.');
    } finally {
      setSavingStore(false);
    }
  };

  // جلب منتجات هذا المتجر
  const fetchMyProducts = async () => {
    if (!currentUser?.email) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
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

  // إرسال طلب إنشاء المتجر المبدئي (لأول مرة)
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
      if (!res.ok) throw new Error(data.error || 'فشل إرسال طلب المتجر');

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

  // إضافة منتج جديد
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!title || !price) return;

    let finalCategory = category;
    if (category === 'others') {
      const trimmed = customCategory.trim();
      if (!trimmed) {
        alert(isEn ? 'Please type your custom category name.' : 'يرجى كتابة اسم التصنيف الجديد.');
        return;
      }
      finalCategory = trimmed;

      const alreadyExists = categoriesList.some(
        c => c.nameAr.toLowerCase() === trimmed.toLowerCase() || c.id.toLowerCase() === trimmed.toLowerCase()
      );
      if (!alreadyExists) {
        setCategoriesList(prev => [...prev, { id: trimmed, nameAr: trimmed, nameEn: trimmed }]);
      }
    }

    setAddingProduct(true);
    try {
      const newProductData = {
        title,
        price: `${parseFloat(price).toFixed(3)} ر.ع`,
        category: finalCategory,
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
        setCategory(finalCategory);
        setCustomCategory('');
        fetchMyProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingProduct(false);
    }
  };

  // حذف منتج
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
  // الحالة 1: الطلب قيد المراجعة
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
          onClick={async () => {
            if (onRefreshUser) await onRefreshUser();
            else window.location.reload();
          }}
          className="tactile-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1493d8] text-white hover:bg-[#117bb5] text-xs font-bold transition shadow-sm"
        >
          <RefreshCw size={14} />
          <span>{isEn ? 'Check Approval Now' : 'التحقق من حالة القبول الآن'}</span>
        </button>
      </div>
    );
  }

  // =========================================================================
  // الحالة 2: المتجر معتمد وجاهز للعمل
  // =========================================================================
  if (isApproved) {
    return (
      <div className="max-w-6xl mx-auto py-4 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
        
        {/* ترويسة المتجر */}
        <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* الجانب الأيمن: صورة اللوجو / أيقونة الهوم مع اسم المتجر */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-[#1493d8] border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black overflow-hidden shrink-0 shadow-2xs">
              {currentUser?.storeLogo ? (
                <img 
                  src={currentUser.storeLogo} 
                  alt={currentUser.storeName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store size={30} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">{currentUser.storeName}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>{isEn ? 'Verified' : 'معتمد'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md line-clamp-1">
                {currentUser.storeDesc || currentUser.email}
              </p>
            </div>
          </div>

          {/* الجانب الأيسر: زر تعديل المتجر فوق عدد المنتجات المعروضة */}
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <button
              onClick={handleOpenEditModal}
              className="px-4 py-2 rounded-2xl bg-[#1493d8] hover:bg-[#117bb5] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title={isEn ? "Edit Store Profile" : "تعديل بيانات وهوية المتجر"}
            >
              <Edit3 size={14} />
              <span>{isEn ? 'Edit Store' : 'تعديل المتجر'}</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {myProducts.length} {isEn ? 'Active Products' : 'منتجات معروضة'}
            </span>
          </div>
        </div>

        {/* نافذة تعديل المتجر المنبثقة (Modal) */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div 
              className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
              dir={isEn ? 'ltr' : 'rtl'}
            >
              {/* ترويسة النافذة */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1493d8]/10 text-[#1493d8] flex items-center justify-center">
                    <Edit3 size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black">{isEn ? 'Edit Store Profile' : 'تعديل بيانات وهوية المتجر'}</h2>
                    <p className="text-[11px] text-slate-400">{isEn ? 'Update your logo, name, and details' : 'حدّث شعار المتجر والاسم والوصف ورقم الهاتف'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveStoreUpdates} className="space-y-4">
                
                {/* 1. رفع وتعديل اللوجو */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-[#1493d8]" />
                    <span>{isEn ? 'Store Logo (Replaces the home icon)' : 'شعار المتجر (اللوجو الذي سيظهر مكان أيقونة المتجر)'}</span>
                  </label>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="w-16 h-16 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {editStoreLogo ? (
                        <img src={editStoreLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Store size={26} className="text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="px-3.5 py-2 rounded-xl bg-[#1493d8] hover:bg-[#117bb5] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition shadow-2xs">
                        <Upload size={14} />
                        <span>{isEn ? 'Choose Logo File' : 'اختيار ملف اللوجو'}</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      <span className="text-[10px] text-slate-400 block">
                        {isEn ? 'PNG, JPG up to 2MB' : 'صيغ الصور المتاحة: PNG أو JPG بحجم أقل من 2MB'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. تعديل اسم المتجر */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Store size={13} />
                    <span>{isEn ? 'Store Name *' : 'اسم المتجر *'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] transition ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* 3. تعديل وصف المتجر */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <FileText size={13} />
                    <span>{isEn ? 'Store Description' : 'وصف المتجر والنشاط'}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={editStoreDesc}
                    onChange={(e) => setEditStoreDesc(e.target.value)}
                    placeholder={isEn ? 'Describe your services...' : 'اكتب نبذة مختصرة عن نشاط متجرك...'}
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] transition resize-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* 4. تعديل رقم الهاتف */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Phone size={13} />
                    <span>{isEn ? 'Contact Phone Number' : 'رقم هاتف التواصل وإشعارات الطلب'}</span>
                  </label>
                  <input
                    type="tel"
                    value={editStorePhone}
                    onChange={(e) => setEditStorePhone(e.target.value)}
                    placeholder="91416668"
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] transition ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {isEn ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    type="submit"
                    disabled={savingStore}
                    className="px-5 py-2 rounded-xl bg-[#1493d8] hover:bg-[#117bb5] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>{savingStore ? (isEn ? 'Saving...' : 'جاري الحفظ...') : (isEn ? 'Save Changes' : 'حفظ التعديلات')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* نموذج إضافة منتج جديد */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h2 className="text-sm font-black flex items-center gap-2">
            <PlusCircle size={18} className="text-[#1493d8]" />
            <span>{isEn ? 'Add New Product to Store' : 'إضافة منتج جديد للمتجر'}</span>
          </h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  {isEn ? 'Category *' : 'التصنيف *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isEn ? cat.nameEn : cat.nameAr}
                    </option>
                  ))}
                  <option value="others">
                    {isEn ? '✨ Others (Add new)...' : '✨ أخرى (إضافة تصنيف جديد)...'}
                  </option>
                </select>
              </div>
            </div>

            {category === 'others' && (
              <div className="p-3 rounded-2xl border border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-[#1493d8] mb-1 flex items-center gap-1.5">
                  <Layers size={14} />
                  <span>{isEn ? 'Enter your custom category name:' : 'اكتب اسم التصنيف المخصص الجديد:'}</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder={isEn ? 'e.g., Electronics, Stationery, Handmade' : 'مثال: مستلزمات طبية، قرطاسية، حِرَف يدوية...'}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#1493d8] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'
                  }`}
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                <ImageIcon size={14} />
                <span>{isEn ? 'Product Image (Upload from device)' : 'صورة المنتج (رفع من الملفات أو الكاميرا)'}</span>
              </label>

              {image ? (
                <div className="flex items-center gap-3 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 w-fit">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs" 
                  />
                  <div className="space-y-1 pr-2">
                    <span className="text-[11px] font-bold text-emerald-500 block">
                      {isEn ? '✓ Image selected' : '✓ تم اختيار الصورة بنجاح'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-bold"
                    >
                      <X size={12} />
                      <span>{isEn ? 'Remove image' : 'حذف الصورة'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-4 cursor-pointer transition ${
                  isDark 
                    ? 'border-slate-700 hover:border-[#1493d8] bg-slate-800/40 text-slate-300' 
                    : 'border-slate-300 hover:border-[#1493d8] bg-slate-50 text-slate-600'
                }`}>
                  <Upload size={18} className="text-[#1493d8]" />
                  <span className="text-xs font-bold">
                    {isEn ? 'Click to browse image from your files' : 'اضغط لاختيار صورة من جهازك'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={addingProduct}
                className="w-full sm:w-auto px-6 bg-[#1493d8] hover:bg-[#117bb5] text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PlusCircle size={15} />
                <span>{addingProduct ? (isEn ? 'Adding...' : 'جاري الإضافة...') : (isEn ? 'Upload Product' : 'حفظ ونشر المنتج')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* عرض قائمة المنتجات */}
        <div className="space-y-3">
          <h2 className="text-sm font-black flex items-center gap-2">
            <Package size={18} className="text-[#1493d8]" />
            <span>{isEn ? 'Store Inventory' : 'المنتجات المعروضة في المتجر'}</span>
          </h2>

          {loadingProducts ? (
            <div className="text-center py-12 text-xs text-slate-400 font-bold">
              {isEn ? 'Loading products...' : 'جاري تحميل المنتجات...'}
            </div>
          ) : myProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myProducts.map((prod) => (
                <div 
                  key={prod._id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={prod.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'} 
                      alt={prod.title} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                    <div className="space-y-0.5 truncate">
                      <h3 className="text-xs font-black truncate">{prod.title}</h3>
                      <span className="text-[11px] font-bold text-[#1493d8] block">{prod.price}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{prod.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(prod._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition shrink-0"
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
  // الحالة 3: لم يقم بتهيئة المتجر بعد
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
            className="w-full bg-[#1493d8] hover:bg-[#117bb5] text-white font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <UploadCloud size={16} />
            <span>{setupLoading ? (isEn ? 'Submitting...' : 'جاري إرسال الطلب...') : (isEn ? 'Submit Store Application' : 'إرسال طلب فتح المتجر')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}