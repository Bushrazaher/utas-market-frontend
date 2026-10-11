import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Moon, Sun, Globe, User, 
  Menu, X, Store, ShieldCheck, LogOut, Sparkles 
} from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* 1. أزرار التحكم وحساب المستخدم (اليسار في النمط العربي) */}
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

          {/* تبديل اللغة */}
          <button
            onClick={() => setLanguage && setLanguage(isEn ? 'ar' : 'en')}
            className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black hover:bg-slate-200 transition"
          >
            <Globe size={14} />
            <span>{isEn ? 'AR' : 'EN'}</span>
          </button>

          {/* تبديل الوضع الليلي / الفاتح */}
          <button
            onClick={() => setTheme && setTheme(isDark ? 'light' : 'dark')}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>
        </div>

        {/* 2. شريط البحث المركزي */}
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

        {/* 3. الشعار وزر القائمة (اليمين في النمط العربي) */}
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

      {/* قائمة الجوال المنسدلة */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 animate-in fade-in" dir="rtl">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="ابحث عن منتجات ومتاجر..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs outline-none"
            />
          </form>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={() => { setCurrentView('explore'); setMobileMenuOpen(false); }} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-white">تصفح المنتجات</button>
            <button onClick={() => { setCurrentView('stores'); setMobileMenuOpen(false); }} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-white">المتاجر الطلابية</button>
          </div>
        </div>
      )}
    </header>
  );
}