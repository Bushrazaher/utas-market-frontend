import React, { useState, useEffect } from 'react';
import { 
  Store, Package, ShoppingCart, Settings, Plus, 
  Upload, CheckCircle2, ArrowRight, Trash2, RefreshCw, 
  DollarSign, TrendingUp, Phone, Clock, MapPin, Eye, AlertCircle,
  Printer, MessageCircle
} from 'lucide-react';
import { API_URL } from '../config';

export default function SellerDashboard({ currentUser, setCurrentUser, setCurrentView, onBack }) {
  const [activeTab, setActiveTab] = useState('orders'); // orders, products, profile
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
    const token = localStorage.getItem('utas_token') || localStorage.getItem('token') || '';
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
      const email = currentUser?.email || '';
      const [prodRes, ordRes] = await Promise.all([
        fetch(`${API_URL}/api/products?store=${encodeURIComponent(currentUser?.storeName || '')}`),
        fetch(`${API_URL}/api/orders?email=${encodeURIComponent(email)}`, { headers })
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        // تصفية الطلبات الخاصة بهذا المتجر
        const filtered = Array.isArray(ordData)
          ? ordData.filter(o => o.sellerEmail === email || o.store === currentUser?.storeName)
          : [];
        setOrders(filtered.length > 0 ? filtered : (Array.isArray(ordData) ? ordData : []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, [currentUser?.storeName, currentUser?.email]);

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

  // حذف منتج
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        showNotification('تم حذف المنتج بنجاح');
      }
    } catch {
      showNotification('تعذر حذف المنتج', true);
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

  // 🖨️ دالة طباعة سند التجهيز والتسليم للتاجر (PDF)
  const handlePrintSellerInvoice = (order) => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) return alert('يرجى السماح بالنوافذ المنبثقة.');

    const orderNum = order.orderNumber || order._id.slice(-6);
    const subtotal = Number(order.subtotal || order.totalPrice || 0);
    const platformFee = Number(order.platformFee || (subtotal * 0.05)).toFixed(3);
    const netSellerProfit = Number(subtotal - platformFee).toFixed(3);

    const itemsList = order.items && order.items.length > 0
      ? order.items
      : [{ title: order.productName || 'منتج', quantity: 1, price: subtotal }];

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>سند تجهيز وتسليم - #${orderNum}</title>
        <style>
          * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 0; }
          body { padding: 30px; background: #fff; color: #0f172a; }
          .box { border: 2px solid #0f172a; border-radius: 16px; padding: 25px; max-width: 700px; margin: auto; }
          .top { display: flex; justify-content: space-between; border-bottom: 2px dashed #94a3b8; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: 900; }
          .meta { text-align: left; font-size: 12px; color: #475569; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f1f5f9; padding: 10px; font-size: 12px; text-align: right; }
          td { padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
          .finances { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
          .fin-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
          .fin-total { border-top: 1px solid #86efac; padding-top: 8px; font-size: 15px; font-weight: 900; color: #15803d; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="top">
            <div>
              <div class="title">📦 إشعار تجهيز وتسليم طلب (نسخة التاجر)</div>
              <p style="font-size: 13px; color: #1877F2; font-weight: bold; margin-top: 4px;">متجر: ${order.store}</p>
            </div>
            <div class="meta">
              <p><strong>رقم الطلب:</strong> #${orderNum}</p>
              <p><strong>التاريخ:</strong> ${order.date || new Date().toLocaleDateString('ar-OM')}</p>
            </div>
          </div>
          <div class="details-grid">
            <div>
              <h4 style="color: #64748b; font-size: 11px; margin-bottom: 5px;">بيانات الطالب المستلم:</h4>
              <p><strong>الاسم:</strong> ${order.buyerName || 'طالب جامعي'}</p>
              <p><strong>الهاتف:</strong> ${order.buyerPhone || 'غير متوفر'}</p>
              <p><strong>مكان التسليم:</strong> ${order.deliveryAddress || 'الحرم الجامعي'}</p>
            </div>
            <div>
              <h4 style="color: #64748b; font-size: 11px; margin-bottom: 5px;">تفاصيل الشحن والدفع:</h4>
              <p><strong>طريقة الاستلام:</strong> ${order.deliveryType === 'home_delivery' ? 'توصيل منزلي' : 'استلام داخل الحرم'}</p>
              <p><strong>طريقة الدفع:</strong> ${order.paymentMethod || 'الدفع عند الاستلام'}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>البند / المنتج المطلوب</th>
                <th style="text-align: center;">الكمية</th>
                <th style="text-align: left;">سعر الوحدة</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList.map(i => `
                <tr>
                  <td><strong>${i.title || i.name}</strong></td>
                  <td style="text-align: center;">${i.quantity || 1}</td>
                  <td style="text-align: left;">${Number(i.price).toFixed(3)} ر.ع</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="finances">
            <div class="fin-row">
              <span>إجمالي الطلب:</span>
              <span>${subtotal.toFixed(3)} ر.ع</span>
            </div>
            <div class="fin-row" style="color: #dc2626;">
              <span>عمولة تشغيل المنصة (5%):</span>
              <span>- ${platformFee} ر.ع</span>
            </div>
            <div class="fin-row fin-total">
              <span>صافي أرباحك المستحقة:</span>
              <span>${netSellerProfit} ر.ع</span>
            </div>
          </div>
          <p style="text-align: center; font-size: 11px; color: #94a3b8;">منصة UTAS Market | يرجى مطابقة كود الطلب عند التسليم بالحرم الجامعي.</p>
        </div>
        <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const totalEarnings = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + (Number(o.subtotal) || Number(o.totalPrice) || 0) * 0.95, 0);

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
            <p className="text-xs text-slate-400">إدارة متجرك، استلام الطلبات، وطباعة السندات</p>
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
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'orders' ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 text-slate-300'}`}
        >
          <ShoppingCart size={16} />
          <span>الطلبات الواردة ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'products' ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 text-slate-300'}`}
        >
          <Package size={16} />
          <span>منتجات المتجر ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${activeTab === 'profile' ? 'bg-[#1877F2] text-white shadow-md' : 'bg-white/5 text-slate-300'}`}
        >
          <Store size={16} />
          <span>هوية وشعار المتجر</span>
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

        {/* 1. تبويب الطلبات الواردة مع سندات الطباعة والتواصل عبر واتساب */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">الطلبات الواردة للمتجر ({orders.length})</h2>
                <p className="text-xs text-slate-400">إجمالي الأرباح المستلمة: <strong className="text-emerald-400 font-mono">{totalEarnings.toFixed(3)} ر.ع</strong></p>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((o) => {
                  const subtotal = Number(o.subtotal || o.totalPrice || 0);
                  const netProfit = (subtotal * 0.95).toFixed(3);

                  return (
                    <div key={o._id} className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-white/20 transition">
                      
                      {/* رأس الطلب */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-[#1877F2]">
                            #{o.orderNumber || o._id.slice(-6)}
                          </span>
                          <span className="text-xs bg-white/10 px-3 py-1 rounded-xl text-slate-300">
                            الطالب: <strong className="text-white">{o.buyerName || 'طالب جامعي'}</strong>
                          </span>
                          <span className="text-xs text-slate-400">
                            {o.date || new Date(o.createdAt || Date.now()).toLocaleDateString('ar-OM')}
                          </span>
                        </div>

                        {/* أزرار الإجراءات للتاجر */}
                        <div className="flex items-center gap-2">
                          {/* زر واتساب السريع */}
                          {o.buyerPhone && (
                            <a
                              href={`https://wa.me/968${o.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${o.buyerName}، بخصوص طلبك #${o.orderNumber || ''} من متجر ${o.store}...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition border border-emerald-500/30"
                              title="مراسلة الطالب على واتساب"
                            >
                              <MessageCircle size={14} />
                              <span>واتساب</span>
                            </a>
                          )}

                          {/* زر طباعة سند التجهيز والتسليم */}
                          <button
                            onClick={() => handlePrintSellerInvoice(o)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-[#1877F2] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition"
                            title="طباعة سند التجهيز والتسليم"
                          >
                            <Printer size={14} />
                            <span>سند الطلب (PDF)</span>
                          </button>
                        </div>
                      </div>

                      {/* المنتجات ومكان التسليم */}
                      <div className="space-y-2 text-xs">
                        <p className="font-bold text-white text-sm">
                          المنتجات المطلوبة: <span className="text-slate-300 font-normal">{o.productName}</span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 pt-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#1877F2] shrink-0" />
                            <span>مكان التسليم: {o.deliveryAddress || 'الحرم الجامعي'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-emerald-400 shrink-0" />
                            <span>الهاتف: {o.buyerPhone || 'غير مسجل'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign size={14} className="text-amber-400 shrink-0" />
                            <span>الدفع: {o.paymentMethod || 'الدفع عند الاستلام'}</span>
                          </div>
                        </div>
                      </div>

                      {/* المالية وتحديث الحالة */}
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">الإجمالي: <strong className="text-white">{o.price || `${subtotal} ر.ع`}</strong></span>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                            صافي أرباحك: {netProfit} ر.ع
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">حالة الطلب:</span>
                          <select
                            value={o.status || 'New'}
                            onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="bg-black/60 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                          >
                            <option value="New">طلب جديد</option>
                            <option value="Accepted">تم القبول</option>
                            <option value="Preparing">قيد التجهيز</option>
                            <option value="Ready">جاهز للاستلام</option>
                            <option value="Completed">تم التسليم بنجاح</option>
                            <option value="Cancelled">ملغي</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 text-slate-400 text-xs">
                لا توجد طلبات شراء واردة لمتجرك حتى الآن.
              </div>
            )}
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
                <div key={p._id || p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3 group">
                  <div className="aspect-square rounded-xl bg-black/40 overflow-hidden border border-white/10">
                    <img src={p.image || 'https://placehold.co/200'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-white truncate max-w-[130px]">{p.title}</h4>
                      <span className="text-xs font-black text-emerald-400 mt-0.5 block">{p.price} ر.ع</span>
                      <span className="text-[10px] text-slate-400">المخزون: {p.stock}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p._id || p.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-white/10 transition"
                      title="حذف المنتج"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. تبويب هوية وشعار المتجر */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-white">إعدادات هوية وشعار المتجر</h2>
              <p className="text-xs text-slate-400 mt-0.5">قم برفع شعار متجرك وبيانات التواصل لتظهر للطلاب والمشترين في المتجر.</p>
            </div>

            <form onSubmit={handleSaveStoreProfile} className="space-y-6">
              
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

      </main>
    </div>
  );
}