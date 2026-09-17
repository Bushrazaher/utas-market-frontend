import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, RefreshCw, ShoppingBag, Store } from 'lucide-react';

export default function NasrAiWidget({ onAddToCart, setCurrentView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'أهلاً بك! أنا أحمد 🤖، مرشدك الذكي داخل الحرم الجامعي. كيف يمكنني مساعدتك اليوم؟',
      recommendations: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const promptSuggestions = [
    { label: '📚 مذكرات IT', text: 'أبحث عن مذكرات لطلاب تقنية المعلومات' },
    { label: '🍪 حلويات قريبة', text: 'أريد متجر حلويات قريب من مبنى الأنشطة' },
    { label: '🎨 بوسترات تخرج', text: 'خدمات تصميم بوسترات ومشاريع تخرج' },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // إخفاء تلميح المساعد بعد 6 ثوانٍ تلقائياً
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'يسعدني مساعدتك في ذلك! يمكنك تصفح المنتجات المتاحة أو البحث عبر المتجر.';
      let recs = [];
      const q = query.toLowerCase();

      if (q.includes('مذكرة') || q.includes('كتب') || q.includes('تقنية') || q.includes('it') || q.includes('برمجة')) {
        botResponse = 'وجدت لك مذكرة برمجة معتمدة لدى "مكتبة الطالب الذكي":';
        recs = [
          {
            id: 2,
            title: 'مذكرة برمجة ويب (مطبوعة)',
            store: 'مكتبة الطالب الذكي',
            price: '3.500 OMR',
            category: 'كتب ومذكرات'
          }
        ];
      } else if (q.includes('حلويات') || q.includes('كوكيز') || q.includes('أكل') || q.includes('أنشطة')) {
        botResponse = 'متجر "Sweet Bites" في مبنى الأنشطة الطلابية يقدم خيارات طازجة:';
        recs = [
          {
            id: 101,
            title: 'بوكس كوكيز مكس (4 قطع)',
            store: 'Sweet Bites',
            price: '2.000 OMR',
            category: 'مأكولات ومشروبات'
          }
        ];
      } else if (q.includes('تصميم') || q.includes('بوستر') || q.includes('تخرج')) {
        botResponse = 'خدمة التصميم الاحترافية متوفرة لدى "استوديو الإبداع":';
        recs = [
          {
            id: 102,
            title: 'تصميم بوستر مشروع تخرج معتمد',
            store: 'استوديو الإبداع',
            price: '6.000 OMR',
            category: 'خدمات طلابية'
          }
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          recommendations: recs
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none" dir="rtl">
      
      {/* نافذة المحادثة المنبثقة */}
      {isOpen && (
        <div className="tactile-card mb-4 w-[340px] sm:w-[380px] h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* رأس النافذة */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-700 p-4 text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-lg border border-white/20">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5">
                  أحمد
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-normal">المساعد الذكي</span>
                </h3>
                <p className="text-[10px] text-blue-100/80">متصل الآن لمساعدتك</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([{ id: 1, sender: 'bot', text: 'تمت إعادة الضبط! كيف أساعدك؟', recommendations: [] }])}
                className="p-1.5 rounded-lg hover:bg-white/15 text-blue-100 hover:text-white transition"
                title="محادثة جديدة"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 text-blue-100 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ساحة الرسائل */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tr-none'
                        : 'bg-[#1e3a8a] text-white shadow-xs rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* كروت المنتجات المقترحة داخل الشات */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="w-full mt-2 space-y-1.5">
                      {msg.recommendations.map((rec) => (
                        <div key={rec.id} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
                          <div className="truncate">
                            <h5 className="text-[11px] font-bold text-slate-900 truncate">{rec.title}</h5>
                            <span className="text-[10px] font-black text-[#1e3a8a]">{rec.price}</span>
                          </div>
                          <button
                            onClick={() => onAddToCart && onAddToCart(rec)}
                            className="tactile-btn bg-[#1e3a8a] hover:bg-blue-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                          >
                            <ShoppingBag size={11} />
                            طلب
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-tr-none w-14 flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* خيارات سريعة */}
          <div className="px-3 pt-2 bg-white flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.text)}
                className="tactile-btn text-[10px] font-bold bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1e3a8a] border border-slate-200 px-2.5 py-1 rounded-full shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* حقل الإدخال */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اسأل أحمد عن أي خدمة أو منتج..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#1e3a8a] focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="tactile-btn bg-[#1e3a8a] hover:bg-blue-800 disabled:bg-slate-200 text-white p-2 rounded-xl transition"
            >
              <Send size={14} className="rtl:-scale-x-100" />
            </button>
          </form>

        </div>
      )}

      {/* زر الأيقونة العائمة المتحركة "أحمد" */}
      <div className="relative flex items-center gap-3">
        {/* تلميح ترحيبي عائم */}
        {!isOpen && showTooltip && (
          <div className="tactile-card bg-white text-slate-800 text-xs font-bold py-1.5 px-3 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-1.5 animate-bounce">
            <Sparkles size={13} className="text-amber-500" />
            <span>اسأل أحمد!</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className="tactile-btn relative flex items-center gap-2.5 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white px-4 py-3 rounded-full shadow-xl shadow-blue-900/30 border-2 border-white transition-all hover:scale-105 active:scale-95 group"
        >
          {/* تأثير النبض الحركي خلف الأيقونة */}
          <span className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-40 blur-sm group-hover:opacity-75 animate-pulse"></span>
          
          <div className="relative flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="text-xs font-black tracking-wide">أحمد</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
        </button>
      </div>

    </div>
  );
}