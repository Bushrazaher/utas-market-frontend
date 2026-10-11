import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, Moon, Sun, Globe, User, 
  Menu, X, Bell, CheckCheck, Trash2, Package, 
  Sparkles, ExternalLink, LogOut, Info, AlertCircle
} from 'lucide-react';
import { API_URL } from '../config';

export default function Navbar({
  currentUser,
  setCurrentUser,
  setCurrentView,
  cartCount = 0,
  language = 'ar',
  setLanguage,
  theme = 'light',
  setTheme,
  onSearch
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // حالات نظام الإشعارات
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastNotif, setToastNotif] = useState(null);
  const notifRef = useRef(null);

  // تشغيل نغمة تنبيه لطيفة باستخدام Web Audio API عند وصول إشعار جديد
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // نغمة D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // نغمة A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  };

  // دالة جلب الإشعارات الدورية
  const fetchNotifications = async (isInitial = false) => {
    if (!currentUser?.email) return;

    try {
      const res = await fetch(`${API_URL}/api/notifications/${encodeURIComponent(currentUser.email)}`);
      if (!res.ok) return;

      const data = await res.json();
      if (Array.isArray(data)) {
        const unread = data.filter(n => !n.isRead).length;

        // إذا وصل إشعار جديد أثناء تصفح المستخدم
        if (!isInitial && unread > unreadCount && data.length > 0) {
          const latest = data[0];
          playNotificationSound();
          setToastNotif(latest);
          setTimeout(() => setToastNotif(null), 5000); // إخفاء التنبيه بعد 5 ثوانٍ
        }

        setNotifications(data);
        setUnreadCount(unread);
      }
    } catch (err) {}
  };

  // فحص دوري ذكي كل 15 ثانية (Polling)
  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUser?.email, unreadCount]);

  // إغلاق النافذة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تحديد إشعار مفرد كمقروء
  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  // تحديد الكل كمقروء
  const handleMarkAllAsRead = async () => {
    if (!currentUser?.email) return;
    try {
      await fetch(`${API_URL}/api/notifications/read-all/${encodeURIComponent(currentUser.email)}`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  // حذف إشعار
  const handleDeleteNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (e) {}
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
    setCurrentView('explore');
  };

  const handleLogout = () => {
    localStorage.removeItem('utas_token');
    localStorage.removeItem('utas_user');
    if (setCurrentUser) setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <>
      {/* 🔔 الإشعار المنبثق الفوري (Toast) عند ورود طلب أو تحديث */}
      {toastNotif && (
        <div 
          onClick={() => {
            setIsNotifOpen(true);
            setToastNotif(null);
          }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#131b2e] border-2 border-[#1877F2] text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3.5 cursor-pointer animate-in slide-in-from-top-6 duration-300 max-w-md w-[92%]"
          dir="rtl"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-[#1877F2] flex items-center justify-center shrink-0">
            <Bell size={20} className="animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs text-white truncate">{toastNotif.title}</h4>
              <span className="text-[10px] text-sky-400 font-bold">الآن</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">{toastNotif.message}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setToastNotif(null); }}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* الشريط العلوي الأساسي */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* الجانب الأيسر: التحكم، الإشعارات، السلة، الحساب */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* حساب المستخدم */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') setCurrentView('admin');
                    else if (currentUser.role === 'seller' || currentUser.isStoreConfigured) setCurrentView('seller');
                    else setCurrentView('orders');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-[#1877F2] font-black text-xs hover:bg-blue-100 transition shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[11px] font-black">
                    {currentUser.name ? currentUser.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold truncate max-w-[100px]">{currentUser.name}</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-blue-600 text-white font-black text-xs rounded-2xl transition shadow-md shadow-blue-500/20"
              >
                <User size={15} />
                <span>دخول</span>
              </button>
            )}

            {/* 🔔 قائمة الإشعارات الذكية المنسدلة */}
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative p-2.5 rounded-2xl border transition ${
                    isNotifOpen 
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1877F2] text-[#1877F2]' 
                      : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-200 hover:border-slate-300'
                  }`}
                  title="الإشعارات والتنبيهات"
                >
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* صندوق الإشعارات المنسدل */}
                {isNotifOpen && (
                  <div 
                    className="absolute left-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-200"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">مركز الإشعارات</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                            {unreadCount} جديد
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#1877F2] hover:underline"
                        >
                          <CheckCheck size={14} />
                          <span>تحديد الكل كمقروء</span>
                        </button>
                      )}
                    </div>

                    {/* قائمة عناصر الإشعارات */}
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((note) => (
                          <div
                            key={note._id}
                            onClick={() => {
                              handleMarkAsRead(note._id);
                              if (note.type === 'new_order') setCurrentView('seller');
                              else if (note.type === 'order_status') setCurrentView('orders');
                              setIsNotifOpen(false);
                            }}
                            className={`p-3 rounded-2xl transition cursor-pointer flex items-start gap-3 group border ${
                              note.isRead 
                                ? 'bg-slate-50 dark:bg-black/20 border-transparent opacity-75' 
                                : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              note.type === 'new_order' 
                                ? 'bg-emerald-500/20 text-emerald-500' 
                                : 'bg-blue-500/20 text-[#1877F2]'
                            }`}>
                              <Package size={16} />
                            </div>

                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between gap-2">
                                <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {note.title}
                                </h5>
                                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                  {new Date(note.createdAt).toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                                {note.message}
                              </p>
                            </div>

                            <button
                              onClick={(e) => handleDeleteNotif(e, note._id)}
                              className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition rounded-lg"
                              title="حذف الإشعار"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 space-y-2">
                          <Bell size={32} className="mx-auto text-slate-400 opacity-40" />
                          <p className="text-xs font-bold text-slate-400">لا توجد إشعارات جديدة حالياً</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* سلة المشتريات */}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#1877F2] border border-transparent transition"
              title="سلة المشتريات"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1877F2] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* تبديل الوضع الليلي / الفاتح */}
            <button
              onClick={() => setTheme && setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>
          </div>

          {/* شريط البحث المركزي */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن مذكرات، كوكيز، مشاريع، خدمات..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pr-11 pl-4 py-2.5 text-xs outline-none focus:border-[#1877F2] focus:bg-white dark:focus:bg-slate-900 transition shadow-inner text-slate-800 dark:text-white"
              />
            </div>
          </form>

          {/* الشعار والقائمة الجانبية */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('home')} 
              className="flex items-center gap-2 group text-right"
            >
              <div>
                <span className="text-lg font-black tracking-wider text-[#1877F2] block leading-none">
                  UTAS MARKET
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest block mt-0.5">
                  سوق الطلاب الرقمي
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1877F2] to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition">
                <Sparkles size={20} />
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white md:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}