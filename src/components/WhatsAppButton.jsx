import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ 
  phone, 
  productTitle = '', 
  language = 'ar' 
}) {
  if (!phone) return null;
  const isEn = language === 'en';

  // تنسيق الرسالة التلقائية لتسهيل التواصل على المشتري
  const defaultMsg = isEn 
    ? `Hello, I'm interested in your product "${productTitle}" on UTAS Market.` 
    : `مرحباً، أهتم بالاستفسار عن منتجك "${productTitle}" المعروض في منصة UTAS Market.`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="tactile-btn flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition shadow-md w-full"
      title="مراسلة البائع مباشرة"
    >
      <MessageCircle size={16} />
      <span>{isEn ? 'Chat on WhatsApp' : 'مراسلة البائع عبر واتساب'}</span>
    </a>
  );
}