import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCcw } from 'lucide-react';

export default function AiAgentView() {
  // الرسالة الترحيبية الافتراضية للمساعد
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'أهلاً بك في منصة UTAS Market! 👋 أنا المساعد الذكي الخاص بك. كيف يمكنني مساعدتك اليوم في العثور على المنتجات أو الخدمات الجامعية؟'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // مرجع لجعل المحادثة تنزل للأسفل تلقائياً
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // دالة إرسال الرسالة
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. إضافة رسالة المستخدم
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. محاكاة رد الذكاء الاصطناعي (مؤقتاً حتى يتم ربطه بـ API حقيقي)
    setTimeout(() => {
      const aiResponse = generateFakeAiResponse(newUserMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  // دالة مؤقتة لتوليد ردود بسيطة للمحاكاة
  const generateFakeAiResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('تصميم') || text.includes('لوجو')) {
      return "رائع! لدينا العديد من الطلاب الموهوبين في التصميم. يمكنك زيارة قسم 'التصنيفات' ثم اختيار 'الخدمات' لرؤية عروض التصميم الجرافيكي المتاحة.";
    } else if (text.includes('سعر') || text.includes('بكم')) {
      return "تختلف الأسعار حسب المنتج والخدمة. عادةً ما تكون الأسعار هنا مدعومة ومناسبة للطلاب! هل تبحث عن منتج معين لمعرفة سعره؟";
    }
    return "هذا سؤال ممتاز! كوني مساعداً ذكياً تحت التجربة، لا أمتلك إجابة دقيقة حالياً، ولكن يمكنك استكشاف المنتجات من الشريط الجانبي وسأكون هنا متى ما احتجتني. ✨";
  };

  const handleClearChat = () => {
    setMessages([{ id: 1, sender: 'ai', text: 'تم بدء محادثة جديدة. كيف أخدمك؟' }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
      
      {/* رأس المحادثة (Header) */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 p-5 text-white flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              المساعد الذكي (Beta) <Sparkles size={16} className="text-yellow-300" />
            </h2>
            <p className="text-blue-100 text-xs">متصل وجاهز للمساعدة</p>
          </div>
        </div>
        
        <button 
          onClick={handleClearChat}
          className="p-2 hover:bg-white/10 rounded-lg transition text-blue-100 hover:text-white"
          title="تحديث المحادثة"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* منطقة عرض الرسائل (Chat Area) */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* أيقونة المتحدث */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
                ${msg.sender === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* صندوق الرسالة */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed
                ${msg.sender === 'user' 
                  ? 'bg-[#1e3a8a] text-white rounded-tl-none shadow-md' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tr-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* مؤشر جاري الكتابة... */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%] flex-row">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة إدخال النص (Input Area) */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اسأل المساعد الذكي عن أي شيء..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-[#1e3a8a] hover:bg-blue-800 disabled:bg-blue-300 text-white rounded-xl px-5 flex items-center justify-center transition-colors shadow-md"
          >
            <Send size={18} className="rtl:-scale-x-100" /> {/* قلب أيقونة الإرسال للغة العربية */}
          </button>
        </form>
      </div>
    </div>
  );
}