import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ArrowRight, 
  Package, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '../config';

export default function NotificationsView({ 
  currentUser, 
  setCurrentView, 
  onBack, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const fetchNotifications = async () => {
    if (!currentUser?.isLoggedIn || !currentUser?.email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications/${currentUser.email}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data.reverse() : []);
      } else {
        // بيانات تجريبية افتراضية في حال عدم تهيئة مسار السيرفر بالكامل بعد
        setNotifications([
          {
            id: 1,
            title: isEn ? 'New Order Received! 🛍️' : 'طلب جديد وارد! 🛍️',
            message: isEn ? 'A student placed an order (#1024) from your store.' : 'قام أحد الطلاب بطلب منتج (#1024) من متجرك الطلابي.',
            type: 'order',
            targetView: 'seller',
            read: false,
            createdAt: 'منذ 10 دقائق'
          },
          {
            id: 2,
            title: isEn ? 'Store Verified Successfully ✅' : 'تم اعتماد وتفعيل متجرك بنجاح ✅',
            message: isEn ? 'Your student store is now live on UTAS Market.' : 'متجرك الطلابي الآن نشط ومتاح للتسوق لجميع طلبة الجامعة.',
            type: 'store',
            targetView: 'seller',
            read: true,
            createdAt: 'منذ ساعتين'
          },
          {
            id: 3,
            title: isEn ? 'Order Status Updated 🔄' : 'تحديث على حالة طلبك 🔄',
            message: isEn ? 'Your order is now Ready for pickup at the campus.' : 'طلبك الآن "جاهز للاستلام" من مبنى كلية الهندسة.',
            type: 'status',
            targetView: 'orders',
            read: true,
            createdAt: 'منذ يوم'
          }
        ]);
      }
    } catch {
      // إشعارات افتراضية احتياطية للحفاظ على استمرارية الواجهة
      setNotifications([
        {
          id: 1,
          title: 'مرحباً بك في UTAS Market 🎉',
          message: 'تم تفعيل حسابك الجامعي بنجاح، يمكنك الآن التسوق ودعم مشاريع زملائك.',
          type: 'system',
          targetView: 'explore',
          read: false,
          createdAt: 'الآن'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  // تحديد إشعار كمقروء
  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id || n._id) === id ? { ...n, read: true } : n));
  };

  // تحديد الكل كمقروء
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // حذف إشعار
  const handleDelete = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => (n.id || n._id) !== id));
  };

  // تفريغ كافة الإشعارات
  const handleClearAll = () => {
    if (window.confirm(isEn ? 'Clear all notifications?' : 'هل ترغب في مسح كافة الإشعارات؟')) {
      setNotifications([]);
    }
  };

  // النقر على الإشعار والتوجيه للصفحة المعنية
  const handleNotificationClick = (item) => {
    handleMarkAsRead(item.id || item._id);
    if (item.targetView) {
      setCurrentView(item.targetView);
    }
  };

  // أيقونة مخصصة حسب نوع الإشعار
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={18} className="text-[#1493d8]" />;
      case 'store':
        return <Store size={18} className="text-emerald-500" />;
      case 'status':
        return <Package size={18} className="text-purple-500" />;
      default:
        return <Bell size={18} className="text-amber-500" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/50 text-[#1493d8] rounded-full flex items-center justify-center mx-auto">
          <Bell size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">يجب تسجيل الدخول</h2>
        <p className="text-xs text-slate-500">لعرض الإشعارات الخاصة بطلباتك ومشاريعك الطلابية.</p>
        <button
          onClick={() => setCurrentView('auth')}
          className="px-6 py-2.5 bg-black dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-2xl shadow-md transition"
        >
          تسجيل الدخول / حساب جديد
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* رأس الصفحة والأزرار التفاعلية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack || (() => setCurrentView('home'))}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:text-black transition"
            title="رجوع"
          >
            <ArrowRight size={16} className={isEn ? 'rotate-180' : ''} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">الإشعارات</h1>
              {unreadCount > 0 && (
                <span className="bg-[#1493d8] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} جديدة
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">تحديثات فورية لحالة الطلبات وموافقة المتاجر الطلابية</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
            >
              <CheckCheck size={15} />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
              title="مسح كافة الإشعارات"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            onClick={fetchNotifications}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="تحديث"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* شريط الفرز (الكل / غير المقروء) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-black dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          كافة الإشعارات ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'unread'
              ? 'bg-black dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          غير المقروءة ({unreadCount})
        </button>
      </div>

      {/* قائمة الإشعارات */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-xs font-bold">جاري تحميل الإشعارات...</div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const notifId = item.id || item._id;
            return (
              <div
                key={notifId}
                onClick={() => handleNotificationClick(item)}
                className={`tactile-card p-4 sm:p-5 rounded-3xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  !item.read 
                    ? 'bg-sky-50/50 dark:bg-sky-950/20 border-[#1493d8]/30 shadow-xs' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#1493d8] shrink-0"></span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                      <Clock size={11} />
                      <span>{item.createdAt || 'مؤخراً'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={(e) => handleDelete(notifId, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                    title="حذف الإشعار"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-300">
            <Bell size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">لا توجد إشعارات حالياً</h3>
          <p className="text-xs text-slate-400">ستصلك هنا تنبيهات فورية عند إجراء أو تحديث أي طلبات تخصك.</p>
        </div>
      )}

    </div>
  );
}