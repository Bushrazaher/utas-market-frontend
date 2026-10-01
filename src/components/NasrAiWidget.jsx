import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ShoppingBag, Gift, HelpCircle } from 'lucide-react';

export default function NasrAiWidget({ setCurrentView, onAddToCart, cart = [], currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: `مرحباً ${currentUser?.name ? currentUser.name.split(' ')[0] : 'بك'}! أنا مساعد UTAS الذكي. أساعدك في اختيار المنتجات، اقتراح الهدايا، وحساب التكلفة ومتابعة طلباتك.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'أريد هدية مناسبة بحدود 10 ريال',
    'ماذا يوجد في سلتي الآن؟',
    'ما هي المنتجات الأكثر مبيعاً؟',
    'أين طلبي الأخير؟'
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = "بإمكانك تصفح متجر UTAS Market واكتشاف خيارات متنوعة عبر قسم الاستكشاف.";

      if (text.includes('سلتي') || text.includes('السلة')) {
        reply = cart.length > 0 
          ? `يوجد في سلتك حالياً (${cart.length}) منتجات. هل تود الانتقال لصفحة السلة لإتمام الطلب؟`
          : "سلتك فارغة حالياً! يمكنك استكشاف منتجات الطلاب واختيار ما يناسبك.";
      } else if (text.includes('هدية') || text.includes('10')) {
        reply = "اقتراحات هدايا مميزة بحدود 10 ر.ع من متاجر UTAS:\n• كوب حراري فاخر (3.5 ر.ع)\n• حقيبة كتف أنيقة (7.5 ر.ع)\n• دفتر ملاحظات جامعي (2.5 ر.ع)\nجميعها متاحة مع استلام مباشر من الحرم الجامعي.";
      } else if (text.includes('طلبي')) {
        reply = "طلبك الأخير رقم #1024:\n• المتجر: Creative Store\n• الحالة: قيد التجهيز 🔄\nيمكنك مراجعة كامل التفاصيل من صفحة 'طلباتي'.";
      } else if (text.includes('الأكثر مبيعاً') || text.includes('مبيعا')) {
        reply = "المنتجات الأكثر طلباً هذا الأسبوع:\n1. حقيبة ظهر طلابية (Tech Student)\n2. سماعات عازلة للصوت\n3. ملخصات مواد الهندسة وتكنولوجيا المعلومات.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50" dir="rtl">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#1877F2] hover:bg-blue-600 text-white px-5 py-3 rounded-full shadow-2xl transition hover:scale-105 font-bold text-xs"
        >
          <Sparkles size={16} />
          <span>اسأل مساعد UTAS</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[460px] animate-in fade-in">
          <div className="bg-[#1877F2] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <div>
                <h3 className="font-bold text-xs">مساعد UTAS الذكي</h3>
                <span className="text-[10px] text-blue-100">متصل لدعمك في الشراء والتتبع</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/40 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-3 rounded-2xl max-w-[80%] whitespace-pre-line leading-relaxed ${
                  m.sender === 'user' ? 'bg-[#1877F2] text-white rounded-tl-none font-medium' : 'bg-white dark:bg-slate-800 border text-slate-800 dark:text-slate-200 rounded-tr-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-slate-400 text-[10px] animate-pulse">المساعد يجهز لك الإجابة...</div>}
          </div>

          <div className="p-2 border-t flex gap-1.5 overflow-x-auto scrollbar-none bg-white dark:bg-slate-900">
            {quickPrompts.map((p, i) => (
              <button key={i} onClick={() => handleSend(p)} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded-full shrink-0 hover:bg-blue-50 text-slate-600 dark:text-slate-300">
                {p}
              </button>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2 bg-white dark:bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب استفسارك..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
            />
            <button onClick={() => handleSend()} className="p-2 bg-[#1877F2] text-white rounded-xl">
              <Send size={14} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}