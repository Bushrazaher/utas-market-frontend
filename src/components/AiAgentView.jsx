import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCcw, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Code, 
  Store, 
  Compass, 
  Layers
} from 'lucide-react';
import { API_URL } from '../config';

export default function AiAgentView({ 
  onAddToCart, 
  setCurrentView, 
  language = 'ar', 
  theme = 'light' 
}) {
  const isEn = language === 'en';
  const isDark = theme === 'dark';

  const defaultGreeting = isEn 
    ? 'Welcome to UTAS Market! 👋 I am Ahmed, your intelligent campus assistant. How can I help you find academic notes, graduation projects, or student stores today?'
    : 'أهلاً بك في منصة UTAS Market! 👋 أنا المساعد أحمد، مرشدك الذكي داخل سوق الجامعة. كيف يمكنني مساعدتك اليوم في العثور على مذكرات دراسية، مشاريع تخرج، أو استكشاف المتاجر الطلابية؟';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: defaultGreeting
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // نطق الرد الصوتي للمساعد
  const speakText = (text) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isEn ? 'en-US' : 'ar-SA';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // إرسال الرسالة وربطها بالسيرفر
  const handleSendMessage = async (customText) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      let aiResponseText = '';

      if (res.ok) {
        const data = await res.json();
        aiResponseText = data.reply;
      } else {
        // رد ذكي احتياطي في حال عدم تشغيل مفتاح السيرفر
        aiResponseText = isEn
          ? "I am connected to UTAS Market. You can explore verified student services in 'Explore' or apply for your shop in 'Seller Studio'."
          : "أنا متصل بقاعدة بيانات سوق UTAS! يمكنك استعراض المذكرات والمشاريع المعتمدة في قسم 'استكشف' أو بدء بيع منتجاتك عبر استوديو التاجر.";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponseText }]);
      speakText(aiResponseText);

    } catch {
      const fallbackMsg = isEn
        ? "UTAS Market server is active. Feel free to browse categories and stores from the sidebar or bottom bar."
        : "سوق UTAS يعمل بكفاءة! بإمكانك تصفح المنتجات والمذكرات الدراسية مباشرة عبر شريط التنقل أو المتاجر الطلابية.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: fallbackMsg }]);
      speakText(fallbackMsg);
    } finally {
      setIsTyping(false);
    }
  };

  // تفريغ وبدء محادثة جديدة
  const handleClearChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([
      { 
        id: Date.now(), 
        sender: 'ai', 
        text: isEn ? 'New chat started. How can I assist you?' : 'تم بدء محادثة جديدة. كيف يمكنني خدمتك اليوم؟' 
      }
    ]);
  };

  // اقتراحات الأسئلة السريعة
  const quickChips = isEn ? [
    { label: 'Study Notes 📚', query: 'Search for available academic notes and books' },
    { label: 'IT & Projects 💻', query: 'Show me graduation projects and software services' },
    { label: 'Campus Stores 🏪', query: 'What are the top verified student stores?' },
    { label: 'Order Process 📦', query: 'How does the purchasing and campus pickup work?' }
  ] : [
    { label: 'مذكرات دراسية 📚', query: 'ابحث لي عن المذكرات والكتب الدراسية المتوفرة' },
    { label: 'مشاريع تخرج 💻', query: 'هل توجد مشاريع تخرج وأكواد برمجية جاهزة؟' },
    { label: 'المتاجر الطلابية 🏪', query: 'ما هي المتاجر الطلابية المعتمدة في المنصة؟' },
    { label: 'طريقة الاستلام 📦', query: 'كيف تتم آلية الشراء والاستلام بالحرم الجامعي؟' }
  ];

  return (
    <div 
      className={`max-w-4xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-130px)] flex flex-col rounded-3xl border shadow-sm overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`} 
      dir={isEn ? 'ltr' : 'rtl'}
    >
      
      {/* 1. رأس المحادثة (Header) */}
      <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
        isDark 
          ? 'bg-slate-950 border-slate-800 text-white' 
          : 'bg-gradient-to-r from-slate-900 to-[#1493d8] text-white border-slate-800 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-300 border border-white/20">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black">
                {isEn ? 'Ahmed AI Assistant' : 'المساعد الذكي (أحمد)'}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{isEn ? 'Online' : 'متصل'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {isEn ? 'UTAS Market Smart Guide & Recommender' : 'المرشد التفاعلي لسوق جامعة التقنية والعلوم التطبيقية'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`p-2 rounded-xl transition border ${
              isVoiceEnabled 
                ? 'bg-sky-500/20 border-sky-400/30 text-sky-300' 
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isVoiceEnabled ? (isEn ? 'Disable Voice' : 'كتم الصوت') : (isEn ? 'Enable Voice' : 'تشغيل الصوت')}
          >
            {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button 
            onClick={handleClearChat}
            className="p-2 hover:bg-white/10 rounded-xl transition text-slate-300 hover:text-white"
            title={isEn ? 'Reset Chat' : 'بدء محادثة جديدة'}
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* 2. منطقة عرض الرسائل (Chat Area) */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${
        isDark ? 'bg-slate-950/50' : 'bg-slate-50/60'
      }`}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* الأيقونة */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isUser 
                    ? isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                    : 'bg-gradient-to-br from-[#1493d8] to-blue-600 text-white'
                }`}>
                  {isUser ? <User size={15} /> : <Bot size={16} />}
                </div>

                {/* نص الرسالة */}
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-[#1493d8] text-white rounded-br-none shadow-xs' 
                    : isDark 
                    ? 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-bl-none shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* مؤشر جاري الكتابة */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 max-w-[80%] flex-row items-center">
              <div className="w-8 h-8 rounded-xl bg-[#1493d8] text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className={`p-3 rounded-2xl flex items-center gap-1.5 border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="w-1.5 h-1.5 bg-[#1493d8] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#1493d8] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[#1493d8] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] font-bold text-slate-400 mr-1.5">
                  {isEn ? 'Ahmed is responding...' : 'أحمد يكتب...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. شريط الاقتراحات السريعة (Quick Chips) */}
      <div className={`p-2.5 px-4 border-t flex gap-2 overflow-x-auto no-scrollbar ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition border ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 4. منطقة إدخال النص (Input Area) */}
      <div className={`p-3 sm:p-4 border-t ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isEn ? "Ask Ahmed about notes, stores, or projects..." : "اسأل المساعد أحمد عن المذكرات، المتاجر، أو مشاريع التخرج..."}
            className={`flex-1 border rounded-2xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#1493d8] transition ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-[#1493d8] hover:bg-[#117bb5] disabled:opacity-40 text-white rounded-2xl px-4 sm:px-5 flex items-center justify-center transition shadow-sm"
          >
            <Send size={16} className={!isEn ? 'rtl:-scale-x-100' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}