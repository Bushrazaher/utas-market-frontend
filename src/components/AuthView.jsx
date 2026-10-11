import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { API_URL } from '../config';

export default function AuthView({ setCurrentView, setCurrentUser }) {
  const [authMode, setAuthMode] = useState('login');
  const [forgotStep, setForgotStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmitAuth = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    const isRegister = authMode === 'register';
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password, role } : { email, password };

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

      if (isRegister) {
        setSuccessMessage('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setPassword('');
        setAuthMode('login');
        setIsLoading(false);
      } else {
        localStorage.setItem('utas_token', data.token);
        localStorage.setItem('utas_user', JSON.stringify(data.user));

        setSuccessMessage('تم تسجيل الدخول بنجاح! جاري التوجيه...');
        setIsLoading(false);

        if (setCurrentUser) {
          setCurrentUser(data.user);
        }
      }
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم، تأكد من تشغيل السيرفر وقاعدة البيانات.');
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'تعذر إرسال الرمز.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح!');
      setForgotStep(2);
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'رمز التحقق غير صحيح.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('تم تغيير كلمة المرور بنجاح! يرجى تسجيل الدخول.');
      setTimeout(() => {
        setAuthMode('login');
        setForgotStep(1);
        setPassword('');
        setOtp('');
        setNewPassword('');
        setSuccessMessage('');
      }, 1500);
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-6 px-4" dir="rtl">
      
      <div className="w-full max-w-md mb-4 flex justify-start">
        <button 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2 text-slate-500 hover:text-black font-bold text-xs bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition"
        >
          <ArrowRight size={16} />
          الرجوع للرئيسية
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-md w-full p-8">
        
        {authMode !== 'forgot' ? (
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'login' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'register' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              حساب جديد
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-6 text-[#1877F2]">
            <KeyRound size={20} />
            <span className="text-xs font-bold">استعادة كلمة المرور</span>
          </div>
        )}

        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
          {authMode === 'register' && 'إنشاء حساب جديد'}
          {authMode === 'login' && 'تسجيل الدخول'}
          {authMode === 'forgot' && 'نسيت كلمة المرور؟'}
        </h2>
        
        <p className="text-xs text-slate-400 mb-5">
          {authMode === 'register' && 'سجل بياناتك للبدء في البيع أو الشراء بأمان.'}
          {authMode === 'login' && 'أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.'}
          {authMode === 'forgot' && forgotStep === 1 && 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز تحقق.'}
          {authMode === 'forgot' && forgotStep === 2 && 'أدخل الرمز المكون من 6 أرقام مع كلمة المرور الجديدة.'}
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

        {authMode !== 'forgot' && (
          <form onSubmit={handleSubmitAuth} className="space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل *</label>
                <div className="relative">
                  <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">كلمة المرور *</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setForgotStep(1); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-[11px] font-bold text-[#1877F2] hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نوع الحساب</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${role === 'buyer' ? 'bg-blue-50 border-[#1877F2] text-[#1877F2]' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    مشتري
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${role === 'seller' ? 'bg-blue-50 border-[#1877F2] text-[#1877F2]' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    تاجر / بائع
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1877F2] hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs transition mt-2 flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>{authMode === 'register' ? 'إنشاء الحساب' : 'دخول'}</span>}
            </button>
          </form>
        )}

        {authMode === 'forgot' && (
          <div className="space-y-4">
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني المسجل *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1877F2] hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>إرسال رمز التحقق</span>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رمز التحقق (OTP) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    placeholder="مثال: 549120"
                    className="w-full bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-center tracking-widest text-base font-black outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور الجديدة *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-[#1877F2]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1877F2] hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>تأكيد وتغيير كلمة المرور</span>}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setAuthMode('login'); setForgotStep(1); setErrorMessage(''); setSuccessMessage(''); }}
              className="w-full text-center text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white pt-2 transition"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        )}

      </div>
    </div>
  );
}