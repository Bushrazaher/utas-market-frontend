import React from 'react';
import { Home, Compass, Store, ShoppingBag, StoreIcon, UserCheck, ShieldCheck } from 'lucide-react';

export default function BottomNav({
  currentView,
  setCurrentView,
  cartCount = 0,
  currentUser,
  language = 'ar',
  theme = 'light'
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  // تحديد وجهة الزر الأخير حسب صلاحية ودور المستخدم
  const getAccountTarget = () => {
    if (!currentUser?.isLoggedIn) return 'auth';
    if (currentUser?.role === 'admin') return 'admin';
    if (currentUser?.role === 'seller' || currentUser?.storeStatus === 'pending') return 'seller';
    return 'orders';
  };

  const accountViewId = getAccountTarget();

  const navItems = [
    { id: 'home', label: isEn ? 'Home' : 'الرئيسية', icon: <Home size={20} /> },
    { id: 'explore', label: isEn ? 'Explore' : 'استكشف', icon: <Compass size={20} /> },
    { id: 'stores', label: isEn ? 'Stores' : 'المتاجر', icon: <Store size={20} /> },
    { 
      id: 'cart', 
      label: isEn ? 'Cart' : 'السلة', 
      icon: <ShoppingBag size={20} />, 
      badge: cartCount 
    },
    {
      id: accountViewId,
      label: !currentUser?.isLoggedIn 
        ? (isEn ? 'Login' : 'دخول')
        : currentUser?.role === 'admin'
        ? (isEn ? 'Admin' : 'الإشراف')
        : (currentUser?.role === 'seller' || currentUser?.storeStatus === 'pending')
        ? (isEn ? 'My Store' : 'متجري')
        : (isEn ? 'Orders' : 'طلباتي'),
      icon: currentUser?.role === 'admin' 
        ? <ShieldCheck size={20} className="text-red-500" />
        : (currentUser?.role === 'seller' || currentUser?.storeStatus === 'pending')
        ? <StoreIcon size={20} className="text-[#1493d8]" />
        : <UserCheck size={20} />
    }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t px-2 py-1.5 flex items-center justify-around select-none backdrop-blur-md transition-colors duration-200 ${
      isDark ? 'bg-slate-900/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-500 shadow-lg'
    }`}>
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
              isActive 
                ? isDark 
                  ? 'text-sky-400 font-black' 
                  : 'text-[#1493d8] font-black' 
                : 'hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#1493d8] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}