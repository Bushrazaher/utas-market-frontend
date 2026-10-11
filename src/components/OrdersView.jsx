import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle2, AlertCircle, 
  ArrowRight, RefreshCw, ShoppingBag, MapPin, 
  Phone, User, Truck, ShieldAlert, Printer, Download, FileText
} from 'lucide-react';
import { API_URL } from '../config';

export default function OrdersView({ currentUser, setCurrentView, onBack, language = 'ar', theme = 'light' }) {
  const isEn = language === 'en';
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMsg('');

    const token = localStorage.getItem('utas_token') || localStorage.getItem('token') || '';
    const userEmail = currentUser?.email || 'buyer@utas.edu.om';

    try {
      const res = await fetch(`${API_URL}/api/orders?email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-user-email': userEmail
        }
      });

      if (!res.ok) {
        throw new Error('تعذر جلب الطلبات من الخادم.');
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.message || 'تعذر جلب الطلبات من الخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  // دالة توليد وطباعة الفاتورة بصيغة PDF احترافية
  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الفاتورة.');
      return;
    }

    const orderNumber = order.orderNumber || order._id.slice(-6);
    const orderDate = order.date || new Date(order.createdAt || Date.now()).toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const buyerName = order.buyerName || currentUser?.name || 'طالب جامعي';
    const buyerPhone = order.buyerPhone || '968XXXXXXXX';
    const subtotal = order.subtotal ? Number(order.subtotal).toFixed(3) : Number(order.price?.replace(/[^\d.]/g, '') || 0).toFixed(3);
    const platformFee = order.platformFee ? Number(order.platformFee).toFixed(3) : (Number(subtotal) * 0.05).toFixed(3);
    const totalPrice = order.totalPrice ? Number(order.totalPrice).toFixed(3) : subtotal;

    // تجهيز بنود المنتجات
    const itemsList = order.items && order.items.length > 0 
      ? order.items 
      : [{ title: order.productName || 'منتج طلابي', quantity: 1, price: subtotal }];

    const invoiceHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة شراء - ${orderNumber}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          body { background: #f8fafc; padding: 30px; color: #1e293b; }
          .invoice-card { max-width: 750px; margin: auto; background: #fff; padding: 35px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; margin-bottom: 25px; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand-logo { width: 48px; height: 48px; background: #1877F2; border-radius: 12px; color: #fff; font-size: 22px; font-weight: 900; display: flex; align-items: center; justify-content: center; }
          .brand-text h1 { font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 2px; }
          .brand-text p { font-size: 11px; color: #64748b; }
          .invoice-meta { text-align: left; }
          .invoice-badge { display: inline-block; background: #eff6ff; color: #1877F2; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 12px; margin-bottom: 6px; }
          .meta-text { font-size: 11px; color: #64748b; line-height: 1.5; }
          
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 18px; border-radius: 14px; border: 1px solid #f1f5f9; }
          .info-block h3 { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 800; margin-bottom: 6px; }
          .info-block p { font-size: 13px; font-weight: 700; color: #1e293b; line-height: 1.4; }

          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          th { background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 800; text-align: right; padding: 12px 14px; border-radius: 8px; }
          td { padding: 14px; font-size: 12px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #334155; }
          
          .summary { display: flex; justify-content: flex-end; margin-bottom: 30px; }
          .summary-box { width: 280px; space-y: 8px; }
          .summary-row { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }
          .summary-row.total { border-top: 2px solid #0f172a; padding-top: 10px; margin-top: 10px; font-size: 15px; font-weight: 900; color: #0f172a; }
          
          .footer { text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; color: #94a3b8; font-size: 11px; }
          .stamp { display: inline-block; border: 2px solid #10b981; color: #10b981; padding: 6px 16px; border-radius: 8px; font-weight: 900; font-size: 13px; margin-bottom: 12px; transform: rotate(-3deg); }

          @media print {
            body { background: #fff; padding: 0; }
            .invoice-card { box-shadow: none; border: none; padding: 10px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div class="brand">
              <div class="brand-logo">U</div>
              <div class="brand-text">
                <h1>UTAS MARKET</h1>
                <p>سوق الطلاب الرقمي المعتمد | حرم الجامعة</p>
              </div>
            </div>
            <div class="invoice-meta">
              <div class="invoice-badge">فاتورة إلكترونية معتمدة</div>
              <div class="meta-text"><strong>رقم الطلب:</strong> #${orderNumber}</div>
              <div class="meta-text"><strong>تاريخ الإصدار:</strong> ${orderDate}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-block">
              <h3>بيانات المشتري والتسليم</h3>
              <p>الطالب: ${buyerName}</p>
              <p>رقم التواصل: ${buyerPhone}</p>
              <p>الموقع: ${order.deliveryAddress || 'الحرم الجامعي'}</p>
            </div>
            <div class="info-block">
              <h3>بيانات المتجر والطلب</h3>
              <p>المتجر الطلابي: <strong>${order.store || 'متجر طلابي'}</strong></p>
              <p>طريقة الاستلام: ${order.deliveryType === 'home_delivery' ? 'توصيل منزلي' : 'استلام من الحرم'}</p>
              <p>طريقة الدفع: ${order.paymentMethod || 'الدفع عند الاستلام'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>تفاصيل المنتج / البند</th>
                <th style="text-align: center;">الكمية</th>
                <th style="text-align: left;">السعر</th>
                <th style="text-align: left;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.title || item.name || 'منتج'}</td>
                  <td style="text-align: center;">${item.quantity || 1}</td>
                  <td style="text-align: left;">${Number(item.price).toFixed(3)} ر.ع</td>
                  <td style="text-align: left;">${(Number(item.price) * (item.quantity || 1)).toFixed(3)} ر.ع</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-box">
              <div class="summary-row">
                <span>المجموع الفرعي:</span>
                <span>${subtotal} ر.ع</span>
              </div>
              <div class="summary-row">
                <span>رسوم تشغيل المنصة (5%):</span>
                <span>${platformFee} ر.ع</span>
              </div>
              <div class="summary-row">
                <span>رسوم التوصيل:</span>
                <span>0.000 ر.ع</span>
              </div>
              <div class="summary-row total">
                <span>الإجمالي النهائي:</span>
                <span>${totalPrice} ر.ع</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="stamp">✓ طلب معتمد ومسجل</div>
            <p>شكراً لدعمك وإسهامك في مشاريع زملائك بجامعة التقنية والعلوم التطبيقية 🎓</p>
            <p style="margin-top: 4px;">هذه الفاتورة مستخرجة إلكترونياً ولا تتطلب ختماً خطياً.</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return { text: 'طلب جديد', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
      case 'Accepted':
        return { text: 'تم القبول', color: 'bg-sky-500/10 text-sky-600 border-sky-500/30' };
      case 'Preparing':
        return { text: 'قيد التجهيز', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
      case 'Ready':
        return { text: 'جاهز للاستلام', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' };
      case 'Completed':
        return { text: 'مكتمل ومستلم', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' };
      case 'Cancelled':
        return { text: 'ملغي', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' };
      default:
        return { text: status || 'معلق', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16 max-w-5xl mx-auto" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* 1. رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1877F2]">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              طلباتي السابقة
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              متابعة حالة الطلبات وتجهيزها للاستلام من الحرم الجامعي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-xs"
            title="تحديث القائمة"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>تحديث</span>
          </button>

          <button
            onClick={onBack || (() => setCurrentView('explore'))}
            className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            <span>متابعة التسوق</span>
            <ArrowRight size={14} className={isEn ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* رسالة الخطأ */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setCurrentView('auth')}
            className="underline hover:text-rose-900 font-black"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      )}

      {/* 2. عرض المحتوى */}
      {isLoading ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-3">
          <RefreshCw size={32} className="mx-auto text-[#1877F2] animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">جاري تحميل سجل طلباتك...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 transition shadow-xs hover:shadow-md space-y-4"
              >
                {/* رأس كرت الطلب */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-[#1877F2]">
                      #{order.orderNumber || order._id.slice(-6)}
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      متجر: <strong className="text-slate-900 dark:text-white">{order.store}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {order.date || new Date(order.createdAt).toLocaleDateString('ar-OM')}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                {/* تفاصيل المنتجات والمحتوى */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {order.productName}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#1877F2] shrink-0" />
                      <span>مكان التسليم: {order.deliveryAddress || 'الحرم الجامعي'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-amber-500 shrink-0" />
                      <span>طريقة الاستلام: {order.deliveryType === 'home_delivery' ? 'توصيل منزلي' : 'تسليم داخل الحرم'}</span>
                    </div>
                  </div>
                </div>

                {/* تذييل الكرت والقيمة الإجمالية + زر تصدير الفاتورة */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">طريقة الدفع: {order.paymentMethod || 'الدفع عند الاستلام'}</span>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">الإجمالي:</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {order.totalPrice ? `${Number(order.totalPrice).toFixed(3)} ر.ع` : order.price}
                      </span>
                    </div>
                  </div>

                  {/* 🖨️ زر تصدير الفاتورة والتحميل كـ PDF */}
                  <button
                    onClick={() => handlePrintInvoice(order)}
                    className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-[#1877F2] text-slate-700 dark:text-slate-200 hover:text-white border border-slate-200 dark:border-slate-600 transition font-bold shadow-xs active:scale-95 group"
                    title="تحميل أو طباعة الفاتورة كملف PDF"
                  >
                    <Printer size={14} className="group-hover:scale-110 transition-transform" />
                    <span>فاتورة الشراء (PDF)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Package size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-base text-slate-900 dark:text-white">لا توجد طلبات سابقة</h3>
            <p className="text-xs text-slate-400">لم تقم بإجراء أي طلبات شراء من المتاجر الطلابية حتى الآن.</p>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="px-6 py-2.5 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      )}

    </div>
  );
}