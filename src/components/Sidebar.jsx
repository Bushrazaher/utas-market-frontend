import React from 'react';
import { 
  Home, 
  Compass, 
  Layers, 
  Store, 
  Heart, 
  Package, 
  Sparkles, 
  StoreIcon, 
  ShieldCheck, 
  LogOut,
  UserCheck,
  Settings
} from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  isOpen,
  setIsOpen,
  currentUser,
  onLogout,
  language = 'ar',
  theme = 'light'
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'home', label: isEn ? 'Home' : 'الرئيسية', icon: <Home size={18} /> },
    { id: 'explore', label: isEn ? 'Explore' : 'استكشف المنتجات', icon: <Compass size={18} /> },
    { id: 'categories', label: isEn ? 'Categories' : 'التصنيفات', icon: <Layers size={18} /> },
    { id: 'stores', label: isEn ? 'Campus Stores' : 'المتاجر الطلابية', icon: <Store size={18} /> },
    { id: 'saved', label: isEn ? 'Wishlist' : 'المفضلة', icon: <Heart size={18} /> },
    { id: 'orders', label: isEn ? 'My Orders' : 'طلباتي', icon: <Package size={18} /> },
    { id: 'settings', label: isEn ? 'Settings' : 'الإعدادات', icon: <Settings size={18} /> },
    { id: 'ai-agent', label: isEn ? 'Nasr AI' : 'المساعد أحمد', icon: <Sparkles size={18} className="text-[#1493d8]" /> },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside 
        className={`fixed md:sticky top-0 z-50 h-screen flex flex-col justify-between transition-all duration-300 ease-in-out select-none border-slate-200 ${
          isEn ? 'border-r left-0' : 'border-l right-0'
        } ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        } ${
          isOpen 
            ? 'w-64 translate-x-0 opacity-100 visible shadow-xl md:shadow-none' 
            : 'w-0 translate-x-full md:w-0 md:translate-x-full opacity-0 invisible overflow-hidden border-none'
        }`}
      >
        <div className="w-64 pt-3">
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isEn ? 'text-left' : 'text-right'
                  } ${
                    active
                      ? isDark ? 'bg-white text-slate-950' : 'bg-black text-white'
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className={`pt-3 my-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              {(currentUser?.role === 'seller' || currentUser?.role === 'admin') && (
                <button
                  onClick={() => {
                    setCurrentView('seller');
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition mb-1 ${
                    isEn ? 'text-left' : 'text-right'
                  } ${
                    currentView === 'seller'
                      ? 'bg-[#1493d8] text-white'
                      : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  <StoreIcon size={18} />
                  <span>{isEn ? 'Seller Studio' : 'متجري'}</span>
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isEn ? 'text-left' : 'text-right'
                  } ${
                    currentView === 'admin'
                      ? 'bg-red-600 text-white'
                      : 'text-red-500 hover:bg-red-50/20'
                  }`}
                >
                  <ShieldCheck size={18} />
                  <span>{isEn ? 'Admin Panel' : 'لوحة الإشراف العليا'}</span>
                </button>
              )}
            </div>
          </nav>
        </div>

        <div className={`w-64 p-3 border-t m-2 rounded-2xl ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
          {currentUser?.isLoggedIn ? (
            <div className="flex items-center justify-between">
              <div className="truncate px-1">
                <span className="block text-xs font-bold truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {currentUser.role === 'admin' 
                    ? (isEn ? 'Admin' : 'مشرف') 
                    : currentUser.role === 'seller' 
                    ? (currentUser.storeName || (isEn ? 'Seller' : 'تاجر')) 
                    : (isEn ? 'Buyer' : 'طالب مشتري')}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition"
                title={isEn ? 'Logout' : 'تسجيل الخروج'}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setCurrentView('auth');
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`w-full text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck size={15} />
              <span>{isEn ? 'Sign In' : 'تسجيل الدخول'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}