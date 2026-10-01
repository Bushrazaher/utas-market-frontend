import React from 'react';
import { ShoppingBag, LogOut, ShieldCheck, Store, Home } from 'lucide-react';

export default function Navbar({ currentUser, setCurrentUser, currentView, setCurrentView, cartCount }) {
  const handleLogout = () => {
    localStorage.removeItem('utas_token');
    localStorage.removeItem('utas_user');
    setCurrentUser({ isLoggedIn: false, role: 'buyer', name: '', email: '' });
    setCurrentView('home');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5" dir="rtl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* الشعار والروابط الرئيسية */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView(currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'seller' ? 'seller' : 'home')}
          >
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm">U</div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">سوق UTAS</span>
          </div>

          {currentUser?.role !== 'admin' && (
            <button
              onClick={() => setCurrentView('home')}
              className={`text-xs font-bold flex items-center gap-1.5 transition ${currentView === 'home' ? 'text-[#1493d8]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Home size={15} />
              <span>المتجر العام</span>
            </button>
          )}
        </div>

        {/* عناصر التحكم والحساب */}
        <div className="flex items-center gap-3">
          
          {/* سلة المشتريات */}
          {currentUser?.role !== 'admin' && (
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="سلة المشتريات"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1493d8] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* حالة تسجيل الدخول */}
          {currentUser?.isLoggedIn ? (
            <div className="flex items-center gap-3 pr-2 border-r border-slate-200">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {currentUser.role === 'admin' ? 'مشرف المنصة' : currentUser.role === 'seller' ? (currentUser.storeName || 'بائع معتمد') : 'طالب مشتري'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                title="تسجيل الخروج"
              >
                <LogOut size={14} />
                <span>خروج</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('auth')}
              className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition shadow-xs"
            >
              تسجيل الدخول
            </button>
          )}

        </div>

      </div>
    </header>
  );
}