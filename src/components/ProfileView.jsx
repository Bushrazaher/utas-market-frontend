import React from 'react';
import { User, Mail, Shield, Store, ShoppingBag, ArrowRight, ArrowLeft, LogOut } from 'lucide-react';

export default function ProfileView({ 
  currentUser, 
  setCurrentView, 
  onLogout, 
  onBack, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';
  const BackIcon = isEn ? ArrowLeft : ArrowRight;

  if (!currentUser?.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4" dir={isEn ? 'ltr' : 'rtl'}>
        <p className="text-sm font-bold text-slate-500">
          {isEn ? 'Please login to access your personal profile.' : 'يرجى تسجيل الدخول للوصول إلى صفحتك الشخصية.'}
        </p>
        <button
          onClick={() => setCurrentView('auth')}
          className="px-6 py-2.5 rounded-2xl bg-[#1493d8] text-white text-xs font-bold shadow-sm"
        >
          {isEn ? 'Sign In Now' : 'تسجيل الدخول الآن'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-3 space-y-6" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* سهم الرجوع الموحد */}
      <button
        onClick={onBack || (() => setCurrentView('home'))}
        className="tactile-btn flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
      >
        <BackIcon size={14} />
        <span>{isEn ? 'Back' : 'الرجوع'}</span>
      </button>

      {/* بطاقة المستخدم الشخصية */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1493d8]/10 text-[#1493d8] flex items-center justify-center font-black text-2xl">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User size={28} />}
          </div>
          <div>
            <h1 className="text-xl font-black">{currentUser.name}</h1>
            <span className="text-xs text-[#1493d8] font-bold block mt-0.5">
              {currentUser.role === 'admin' 
                ? (isEn ? 'Campus Administrator' : 'مشرف المنصة الجامعي') 
                : currentUser.role === 'seller' 
                ? (isEn ? 'Approved Student Merchant' : 'تاجر طلابي معتمد') 
                : (isEn ? 'University Student' : 'طالب جامعي')}
            </span>
          </div>
        </div>

        {/* معلومات المستخدم */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Mail size={13} /> {isEn ? 'University Email' : 'البريد الجامعي'}
            </span>
            <span className="font-black text-slate-700 dark:text-slate-200">{currentUser.email}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Shield size={13} /> {isEn ? 'Store Status' : 'حالة المتجر'}
            </span>
            <span className="font-black text-slate-700 dark:text-slate-200">
              {currentUser.isStoreConfigured 
                ? (isEn ? 'Active & Approved' : 'معتمد ونشط للبيع') 
                : currentUser.storeStatus === 'pending' 
                ? (isEn ? 'Pending Verification' : 'قيد المراجعة والاعتماد') 
                : (isEn ? 'No Store Registered' : 'حساب طالب')}
            </span>
          </div>
        </div>

        {/* أزرار الإجراءات السريعة */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {currentUser.isStoreConfigured ? (
            <button
              onClick={() => setCurrentView('seller')}
              className="px-4 py-2 rounded-xl bg-[#1493d8] hover:bg-[#117bb5] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Store size={14} />
              <span>{isEn ? 'Manage My Store' : 'إدارة متجري'}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('seller')}
              className="px-4 py-2 rounded-xl bg-black hover:bg-slate-800 dark:bg-white dark:text-black text-white text-xs font-bold flex items-center gap-2 transition"
            >
              <Store size={14} />
              <span>{isEn ? 'Open Student Store' : 'فتح متجر طلابي'}</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('orders')}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <ShoppingBag size={14} />
            <span>{isEn ? 'My Orders' : 'سجل الطلبات والمشتريات'}</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-2 mr-auto transition"
          >
            <LogOut size={14} />
            <span>{isEn ? 'Sign Out' : 'تسجيل الخروج'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}