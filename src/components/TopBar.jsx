import React from 'react';
import { 
  Menu, Search, Globe, Moon, Sun, ShoppingBag, 
  LogIn, LogOut, User, X 
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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('utas_theme', newTheme);
  };

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
      {/* زر القائمة الجانبية والشعار */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleSidebar}
          className={`p-2 sm:p-2.5 rounded-2xl border transition flex items-center justify-center cursor-pointer ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="القائمة"
        >
          <Menu size={20} />
        </button>

        <div onClick={() => setCurrentView('home')} className="flex items-center gap-2 cursor-pointer select-none">
          <UtasLogo variant="inline" className="scale-90 sm:scale-100" />
          <span className="text-[10px] font-black tracking-widest text-[#1493d8] uppercase hidden xl:inline">
            UTAS MARKET
          </span>
        </div>
      </div>

      {/* شريط البحث المدمج */}
      <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isEn ? "Search notes, projects..." : "ابحث عن مذكرات، كوكيز، مشاريع..."}
          className={`w-full py-2 text-xs rounded-2xl border outline-none transition rtl:pr-9 rtl:pl-8 ltr:pl-9 ltr:pr-8 ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-white focus:border-[#1493d8]' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#1493d8]'
          }`}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute top-1/2 -translate-y-1/2 left-2.5 rtl:left-2.5 rtl:right-auto ltr:right-2.5 ltr:left-auto text-slate-400">
            <X size={14} />
          </button>
        )}
      </div>

      {/* عناصر التحكم (إعدادات، سلة، حساب) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-2xl border transition flex items-center justify-center ${
            isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
          }`}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          onClick={toggleLanguage}
          className={`px-2.5 py-1.5 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
          }`}
        >
          <Globe size={14} className="text-[#1493d8]" />
          <span>{isEn ? 'عربي' : 'EN'}</span>
        </button>

        <button
          onClick={() => setCurrentView('cart')}
          className={`p-2 rounded-2xl border transition relative flex items-center justify-center ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
          }`}
        >
          <ShoppingBag size={17} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1493d8] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {currentUser?.isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-3 py-1.5 rounded-2xl border text-xs font-black transition flex items-center gap-2 ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <User size={14} className="text-[#1493d8]" />
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCurrentView('auth')}
            className="px-3.5 py-2 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-black transition flex items-center gap-1.5 shadow-sm"
          >
            <LogIn size={15} />
            <span className="hidden sm:inline">{isEn ? 'Login' : 'دخول'}</span>
          </button>
        )}
      </div>
    </header>
  );
}