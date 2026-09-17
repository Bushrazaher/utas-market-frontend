import React from 'react';
import { Menu, Search, ShoppingBag, LogOut, Shield } from 'lucide-react';
import UtasLogo from './UtasLogo';

export default function TopBar({
  currentView,
  setCurrentView,
  toggleSidebar,
  cartCount = 0,
  searchQuery = '',
  setSearchQuery,
  currentUser,
  onLogout,
  language = 'ar',
  theme = 'light'
}) {
  const isAdmin = currentView === 'admin' || currentUser?.role === 'admin';
  const isAuthPage = currentView === 'auth';
  const showSearch = !isAdmin && !isAuthPage;
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  return (
    <header className={`w-full border-b px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0 transition-colors duration-200 ${
      isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-xl border transition flex items-center justify-center shrink-0 ${
            isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
          title={isEn ? 'Toggle Menu' : 'القائمة'}
        >
          <Menu size={20} />
        </button>

        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 cursor-pointer transition hover:opacity-85 shrink-0"
        >
          <UtasLogo className="h-8 w-auto object-contain" />
          <div className="hidden sm:block">
            <span className="font-black text-xs tracking-tight block">UTAS MARKET</span>
            <span className="text-[9px] text-slate-400 font-bold block -mt-0.5">
              {isEn ? 'Campus Hub' : 'الحرم الجامعي'}
            </span>
          </div>
        </div>

        {showSearch && (
          <div className="relative hidden md:block w-64 lg:w-80 mx-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search campus marketplace...' : 'ابحث عن مذكرات، كوكيز، مشاريع...'}
              className={`w-full border rounded-xl px-9 py-2 text-xs outline-none focus:border-[#1493d8] transition ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isEn ? 'left-3' : 'right-3'}`} />
          </div>
        )}

        {isAdmin && (
          <div className={`hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border mx-2 ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <Shield size={14} className="text-[#1493d8]" />
            <span>{isEn ? 'Admin Supervision Panel' : 'نظام الإشراف والرقابة العليا'}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isAdmin && !isAuthPage && (
          <button
            onClick={() => setCurrentView('cart')}
            className={`relative p-2 rounded-xl transition ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            title={isEn ? 'Shopping Cart' : 'سلة المشتريات'}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#1493d8] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {currentUser?.isLoggedIn ? (
          <div className={`flex items-center gap-2.5 px-2 border-slate-200 ${isEn ? 'border-l' : 'border-r'}`}>
            <div>
              <span className="block text-xs font-bold">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {currentUser.role === 'admin' 
                  ? (isEn ? 'Admin' : 'مشرف') 
                  : currentUser.role === 'seller' 
                  ? (currentUser.storeName || (isEn ? 'Seller' : 'تاجر')) 
                  : (isEn ? 'Buyer' : 'طالب')}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl transition"
            >
              <LogOut size={13} />
              <span>{isEn ? 'Exit' : 'خروج'}</span>
            </button>
          </div>
        ) : (
          !isAuthPage && (
            <button
              onClick={() => setCurrentView('auth')}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                isDark ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              {isEn ? 'Sign In' : 'تسجيل الدخول'}
            </button>
          )
        )}
      </div>
    </header>
  );
}