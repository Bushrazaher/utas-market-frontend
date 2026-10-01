import React, { useState, useEffect } from 'react';
import { Sparkles, X, Megaphone } from 'lucide-react';

export default function AnnouncementBar({ language = 'ar' }) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const isEn = language === 'en';

  const messages = isEn ? [
    '🎉 Welcome to UTAS Market - Support student projects now!',
    '🚀 New campus stores are now verified and live!',
    '📦 Cash on delivery available for all campus orders.'
  ] : [
    '🎉 أهلاً بك في UTAS Market — ادعم مشاريع ومتاجر زملائك الطلاب الآن!',
    '🚀 تم اعتماد متاجر طلابية جديدة وتفعيلها للتسوق الفوري!',
    '📦 خدمة الدفع عند الاستلام والتوصيل المباشر داخل الحرم الجامعي متاحة.'
  ];

  // تدوير الرسائل تلقائياً كل 5 ثوانٍ
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#1493d8] via-blue-600 to-[#1493d8] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-xs select-none relative z-40" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="flex items-center gap-2 mx-auto truncate">
        <Megaphone size={15} className="animate-bounce shrink-0" />
        <span className="truncate transition-all duration-500">{messages[currentMsgIndex]}</span>
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-white/20 rounded-lg transition shrink-0"
        title="إغلاق الشريط"
      >
        <X size={14} />
      </button>
    </div>
  );
}