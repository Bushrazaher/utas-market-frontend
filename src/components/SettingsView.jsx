import React, { useState } from 'react';
import { 
  Globe, 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

export default function SettingsView({ currentUser, language, setLanguage, theme, setTheme }) {
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('utas_lang', newLang);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('utas_theme', newTheme);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-6">
      
      {/* عنوان الصفحة */}
      <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <SlidersHorizontal className="text-[#1493d8]" size={22} />
            <span>{isEn ? 'Platform Settings' : 'إعدادات المنصة'}</span>
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isEn ? 'Customize system language, appearance, and notifications' : 'تخصيص لغة النظام، المظهر، وتفضيلات الإشعارات والأمان'}
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 size={15} />
            <span>{isEn ? 'Saved successfully' : 'تم الحفظ والتطبيق'}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        
        {/* 1. اللغة والمنطقة */}
        <div className={`border rounded-2xl p-5 shadow-xs space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 text-xs font-black">
            <Globe size={16} className="text-[#1493d8]" />
            <span>{isEn ? 'Language & Region' : 'اللغة والمنطقة (Language)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLanguageChange('ar')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                !isEn
                  ? 'border-[#1493d8] bg-sky-50 text-[#1493d8] dark:bg-sky-950/40'
                  : isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>العربية (سلطنة عُمان)</span>
              {!isEn && <CheckCircle2 size={15} />}
            </button>

            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                isEn
                  ? 'border-[#1493d8] bg-sky-50 text-[#1493d8] dark:bg-sky-950/40'
                  : isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>English (United Kingdom)</span>
              {isEn && <CheckCircle2 size={15} />}
            </button>
          </div>
        </div>

        {/* 2. المظهر (نهاري / ليلي) */}
        <div className={`border rounded-2xl p-5 shadow-xs space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 text-xs font-black">
            <Sun size={16} className="text-amber-500" />
            <span>{isEn ? 'Appearance & Theme' : 'مظهر المنصة (Appearance)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                !isDark
                  ? 'border-black bg-slate-100 text-slate-900'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun size={15} className="text-amber-500" />
                <span>{isEn ? 'Light Theme' : 'الوضع النهاري (فاتح)'}</span>
              </div>
              {!isDark && <CheckCircle2 size={15} />}
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                isDark
                  ? 'border-sky-500 bg-slate-800 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon size={15} className="text-indigo-400" />
                <span>{isEn ? 'Dark Theme' : 'الوضع الليلي (داكن)'}</span>
              </div>
              {isDark && <CheckCircle2 size={15} />}
            </button>
          </div>
        </div>

        {/* 3. الإشعارات */}
        <div className={`border rounded-2xl p-5 shadow-xs space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 text-xs font-black">
            <Bell size={16} className="text-emerald-500" />
            <span>{isEn ? 'Notification Preferences' : 'تفضيلات الإشعارات'}</span>
          </div>

          <div className={`divide-y text-xs ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold block">{isEn ? 'Direct Order Notifications' : 'إشعارات الطلبات المباشرة'}</span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isEn ? 'Instant alerts on order status updates' : 'تنبيه فوري عند تحديث حالة الطلب أو استلام عملية شراء'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOrders}
                onChange={(e) => setNotifyOrders(e.target.checked)}
                className="w-4 h-4 accent-[#1493d8] cursor-pointer"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold block">{isEn ? 'Campus Deals & Services' : 'العروض والأنشطة الطلابية'}</span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isEn ? 'Alerts for new student notes and products' : 'تنبيهات بالخدمات والمذكرات الجديدة داخل الحرم الجامعي'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyDeals}
                onChange={(e) => setNotifyDeals(e.target.checked)}
                className="w-4 h-4 accent-[#1493d8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. الحساب */}
        <div className={`border rounded-2xl p-5 shadow-xs space-y-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 text-xs font-black">
            <ShieldCheck size={16} className="text-rose-500" />
            <span>{isEn ? 'Account Information' : 'بيانات الحساب والأمان'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
              <span className="text-[10px] text-slate-400 block mb-0.5">{isEn ? 'Authorized Email' : 'البريد الإلكتروني'}</span>
              <span className="font-bold">{currentUser?.email || (isEn ? 'Guest' : 'غير مسجل')}</span>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
              <span className="text-[10px] text-slate-400 block mb-0.5">{isEn ? 'Role' : 'نوع الحساب'}</span>
              <span className="font-bold">
                {currentUser?.role === 'admin' 
                  ? (isEn ? 'Platform Admin' : 'مشرف المنصة') 
                  : currentUser?.role === 'seller' 
                  ? (isEn ? 'Verified Seller' : 'تاجر معتمد') 
                  : (isEn ? 'Student Buyer' : 'طالب مشتري')}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}