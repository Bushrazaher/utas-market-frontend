import React from 'react';
import { 
  Menu, 
  Search, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  ShoppingBag, 
  Bookmark, 
  ShieldCheck, 
  LogIn, 
  LogOut,
  X
} from 'lucide-react';
import UtasLogo from './UtasLogo';

export default function TopBar({
  currentView,
  setCurrentView,
  toggleSidebar,
  cartCount = 0,
  savedCount = 0,
  searchQuery = '',
  setSearchQuery = () => {},
  currentUser,
  onLogout,
  language = 'ar',
  setLanguage = () => {},
  theme = 'light',
  setTheme = () => {}
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  // دالة تبديل الثيم
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('utas_theme', newTheme);
  };

  // دالة تبديل اللغة
  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('utas_lang', newLang);
  };

  return (
    <header 
      className={`h-16 sm:h-20 border-b px-4 sm:px-6 md:px-8 flex items-center justify-between gap-3 sticky top-0 z-30 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-md' 
          : 'bg-white/90 border-slate-200 text-slate-800 backdrop-blur-md shadow-2xs'
      }`}
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. الجانب الأيمن: زر القائمة الجانبية والشعار */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-2xl border transition md:hidden ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
          title="القائمة"
        >
          <Menu size={18} />
        </button>

        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <UtasLogo variant="inline" className="scale-90 sm:scale-100" />
          <span className="text-[10px] font-black tracking-widest text-[#1493d8] uppercase hidden lg:inline">
          
          </span>
        </div>
      </div>

      {/* 2. المنتصف: شريط البحث الجامعي (يظهر في الشاشات المتوسطة والأكبر) */}
      <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
        <Search 
          size={16} 
          className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto text-slate-400 pointer-events-none" 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isEn ? "Search notes, cookies, projects..." : "ابحث عن مذكرات، كوكيز، مشاريع..."}
          className={`w-full py-2 text-xs rounded-2xl border outline-none transition rtl:pr-9 rtl:pl-8 ltr:pl-9 ltr:pr-8 ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-white focus:border-[#1493d8]' 
              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#1493d8]'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 -translate-y-1/2 left-2.5 rtl:left-2.5 rtl:right-auto ltr:right-2.5 ltr:left-auto text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* شارة المشرف العليا إذا كان الحساب مشرفاً */}
      {currentUser?.role === 'admin' && (
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black">
          <ShieldCheck size={14} />
          <span>{isEn ? 'Supervision Mode' : 'نظام الإشراف والرقابة العليا'}</span>
        </div>
      )}

      {/* 3. الجانب الأيسر: زر الدارك مود، اللغة، السلة، الحساب */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        {/* زر التبديل للوضع الليلي والنهاري (Dark / Light Mode) */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-2xl border transition flex items-center justify-center ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
          }`}
          title={isDark ? (isEn ? 'Switch to Light Mode' : 'تفعيل الوضع النهاري') : (isEn ? 'Switch to Dark Mode' : 'تفعيل الوضع الليلي')}
        >
          {isDark ? <Sun size={17} className="animate-spin-slow" /> : <Moon size={17} />}
        </button>

        {/* زر تبديل اللغة */}
        <button
          onClick={toggleLanguage}
          className={`px-2.5 py-1.5 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
          }`}
          title={isEn ? 'تغيير إلى العربية' : 'Switch to English'}
        >
          <Globe size={14} className="text-[#1493d8]" />
          <span>{isEn ? 'عربي' : 'EN'}</span>
        </button>

        {/* زر الإشعارات */}
        <button
          onClick={() => setCurrentView('notifications')}
          className={`p-2 rounded-2xl border transition relative hidden sm:flex items-center justify-center ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
          }`}
          title={isEn ? 'Notifications' : 'الإشعارات'}
        >
          <Bell size={17} />
        </button>

        {/* زر المحفوظات */}
        <button
          onClick={() => setCurrentView('saved')}
          className={`p-2 rounded-2xl border transition relative hidden sm:flex items-center justify-center ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
          }`}
          title={isEn ? 'Saved Items' : 'المفضلة'}
        >
          <Bookmark size={17} />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        {/* زر السلة */}
        <button
          onClick={() => setCurrentView('cart')}
          className={`p-2 rounded-2xl border transition relative flex items-center justify-center ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-2xs'
          }`}
          title={isEn ? 'Cart' : 'السلة'}
        >
          <ShoppingBag size={17} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1493d8] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* حالة الحساب: تسجيل الدخول أو معلومات المستخدم */}
        {currentUser?.isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'seller' ? 'seller' : 'settings')}
              className={`px-3 py-1.5 rounded-2xl border text-xs font-black transition hidden md:flex flex-col text-right ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <span className="leading-tight">{currentUser.name}</span>
              <span className="text-[9px] text-[#1493d8] font-bold">
                {currentUser.role === 'admin' ? (isEn ? 'Admin' : 'مشرف') : currentUser.role === 'seller' ? (isEn ? 'Merchant' : 'تاجر') : (isEn ? 'Student' : 'طالب')}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1 text-xs font-bold"
              title={isEn ? 'Sign Out' : 'تسجيل الخروج'}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{isEn ? 'Exit' : 'خروج'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentView('auth')}
            className="px-3.5 py-2 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
          >
            <LogIn size={15} />
            <span>{isEn ? 'Sign In' : 'تسجيل الدخول'}</span>
          </button>
        )}

      </div>

    </header>
  );
}