import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../config';
export default function AuthView({ setCurrentView, setCurrentUser }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

     //const API_URL = 'http://localhost:5000';
    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegisterMode ? { name, email, password, role } : { email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'حدث خطأ أثناء الاتصال.');
        setIsLoading(false);
        return;
      }

      // الانتقال التلقائي لشاشة تسجيل الدخول بعد اكتمال التسجيل
      if (isRegisterMode) {
        setSuccessMessage('تم إنشاء الحساب بنجاح! تم تحويلك لصفحة تسجيل الدخول.');
        setPassword('');
        setIsRegisterMode(false);
      } else {
        localStorage.setItem('utas_token', data.token);
        localStorage.setItem('utas_user', JSON.stringify(data.user));

        setCurrentUser({
          isLoggedIn: true,
          ...data.user
        });

        setSuccessMessage('تم تسجيل الدخول بنجاح! جاري توجيهك...');

        setTimeout(() => {
          if (data.user.role === 'admin') {
            setCurrentView('admin');
          } else if (data.user.role === 'seller') {
            setCurrentView('seller');
          } else {
            setCurrentView('home');
          }
        }, 800);
      }
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم، تأكد من تشغيل السيرفر وقاعدة البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4" dir="rtl">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8">
        
        {/* أزرار التبديل */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${!isRegisterMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${isRegisterMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
          >
            حساب جديد
          </button>
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-1">
          {isRegisterMode ? 'إنشاء حساب طالب / تاجر' : 'تسجيل الدخول إلى حسابك'}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          {isRegisterMode ? 'سجل بياناتك للبدء في البيع أو الشراء بأمان.' : 'أدخل بريدك الجامعي وكلمة المرور للمتابعة.'}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
              <div className="relative">
                <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: بشرى البوسعيدية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1493d8]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني الجامعي *</label>
            <div className="relative">
              <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@utas.edu.om"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1493d8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور *</label>
            <div className="relative">
              <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1493d8]"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">صفة الحساب</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${role === 'buyer' ? 'bg-sky-50 border-[#1493d8] text-[#1493d8]' : 'border-slate-200 text-slate-500'}`}
                >
                  طالب مشتري
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${role === 'seller' ? 'bg-sky-50 border-[#1493d8] text-[#1493d8]' : 'border-slate-200 text-slate-500'}`}
                >
                  تاجر / بائع
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-slate-900 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold text-xs transition mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>{isRegisterMode ? 'إتمام التسجيل' : 'دخول'}</span>}
          </button>
        </form>
      </div>
    </div>
  );
}