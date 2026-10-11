import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Monitor, Shirt, BookOpen, 
  Dumbbell, Sparkles, Gift, Coffee, MoreHorizontal, 
  Star, ShoppingBag, ArrowLeft, ArrowRight, Store, ShieldCheck, Flame, Compass
} from 'lucide-react';
import { API_URL } from '../config';

export default function HomeView({ setCurrentView, onSelectCategory, onSelectStore, language = 'ar', theme = 'light' }) {
  const isEn = language === 'en';

  // 1. بيانات البنرات الحيوية والمحمية من التداخل
  const defaultSlides = [
    {
      id: 1,
      title: ' UTAS MARKET ',
      subtitle: 'المنصة الطلابية الأولى لاكتشاف ودعم مشاريع زملائك بالحرم الجامعي',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
      gradient: 'from-blue-700 via-indigo-700 to-sky-600',
      accent: 'bg-amber-400 text-slate-950',
      button: 'استكشف المتاجر'
    },
    {
      id: 2,
      title: 'وجبات ومشروبات ساخنة وباردة',
      subtitle: 'اطلب قهوتك ووجبتك الخفيفة المفضلة واستلمها فوراً بين المحاضرات',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200',
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      accent: 'bg-white text-orange-700',
      button: 'تصفح قائمة الطعام'
    },
    {
      id: 3,
      title: 'مستلزمات ومشاريع التقنية والهندسة',
      subtitle: 'أحدث الإكسسوارات والأدوات الجامعية بأسعار خاصة تناسب الطلاب',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
      badge: 'عروض تقنية حصرية',
      gradient: 'from-purple-700 via-violet-700 to-fuchsia-600',
      accent: 'bg-emerald-400 text-slate-950',
      button: 'تسوق الإلكترونيات'
    }
  ];

  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  // جلب البنرات المحفوظة من قاعدة البيانات
  useEffect(() => {
    fetch(`${API_URL}/api/banners`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map((b, idx) => ({
            id: b._id || idx,
            title: b.title,
            subtitle: b.subtitle || '',
            image: b.image,
            badge: b.badge || 'عرض خاص',
            gradient: b.bgColor || 'from-blue-700 via-indigo-700 to-sky-600',
            accent: 'bg-white text-blue-700',
            button: b.buttonText || 'تسوق الآن'
          }));
          setSlides(formatted);
        }
      })
      .catch(() => {});
  }, []);

  // دوران السلايدر التلقائي
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  // 2. تصنيفات زاهية بألوان واضحة وتصميم مشرق
  const categories = [
    { id: 1, name: 'إلكترونيات وأدوات', icon: <Monitor size={22} />, bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900', hover: 'hover:bg-blue-600 hover:text-white' },
    { id: 2, name: 'أزياء وإكسسوارات', icon: <Shirt size={22} />, bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900', hover: 'hover:bg-indigo-600 hover:text-white' },
    { id: 3, name: 'كتب ومذكرات', icon: <BookOpen size={22} />, bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900', hover: 'hover:bg-emerald-600 hover:text-white' },
    { id: 4, name: 'الرياضة واللياقة', icon: <Dumbbell size={22} />, bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900', hover: 'hover:bg-rose-600 hover:text-white' },
    { id: 5, name: 'الجمال والعناية', icon: <Sparkles size={22} />, bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900', hover: 'hover:bg-purple-600 hover:text-white' },
    { id: 6, name: 'هدايا ومطبوعات', icon: <Gift size={22} />, bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900', hover: 'hover:bg-amber-600 hover:text-white' },
    { id: 7, name: 'مأكولات ومشروبات', icon: <Coffee size={22} />, bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900', hover: 'hover:bg-orange-600 hover:text-white' },
    { id: 8, name: 'خدمات طلابية', icon: <MoreHorizontal size={22} />, bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900', hover: 'hover:bg-teal-600 hover:text-white' },
  ];

  const popularStores = [
    { id: 1, name: 'Tech Student', rating: 4.8, category: 'إلكترونيات', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Sweet Bites', rating: 4.9, category: 'مأكولات ومشروبات', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300', logo: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'Creative Store', rating: 4.7, category: 'هدايا ومذكرات', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=300', logo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=100' },
    { id: 4, name: 'Style Hub', rating: 4.6, category: 'ملابس وأزياء', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=300', logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=100' },
  ];

  const bestSellers = [
    { id: 1, name: 'فلاش درايف سانديسك 128 جيجابايت', price: '4.500', store: 'Tech Student', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=120' },
    { id: 2, name: 'كوب كوكيز النوتيلا البلجيكي', price: '1.500', store: 'Sweet Bites', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=120' },
    { id: 3, name: 'سبانش لاتيه بارد ومثلج', price: '1.800', store: 'Sweet Bites', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=120' },
    { id: 4, name: 'حامل لابتوب ألمنيوم قابل للطي', price: '6.800', store: 'Tech Student', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=120' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-16" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* 1. البنر الرئيسي المطور (تباين عالي وحل مشكلة تداخل النصوص نهائياً) */}
      <div className="relative w-full h-[250px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* صورة الخلفية مع طبقة تغميق غنية لضمان وضوح النص 100% */}
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90 mix-blend-multiply`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* نصوص البنر ذات التباين العالي */}
              <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-14 max-w-2xl text-white space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-md text-white">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed drop-shadow-sm max-w-lg">
                  {slide.subtitle}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('explore')}
                    className={`px-7 py-3 rounded-full font-black text-xs shadow-lg transition hover:scale-105 active:scale-95 ${slide.accent || 'bg-white text-slate-900'}`}
                  >
                    {slide.button || 'تسوق الآن'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* أزرار التنقل بين الشرائح */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition border border-white/20"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition border border-white/20"
            >
              <ChevronLeft size={20} />
            </button>

            {/* مؤشرات الشرائح السفلية */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-white w-8 shadow-md' : 'bg-white/40 w-2.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. تصنيفات بألوان زاهية وواضحة (بدل المربعات المعتمة) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-black font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="text-[#0000]" size={18} />
            <span>الأقسام والتصنيفات</span>
          </h2>
          <button onClick={() => setCurrentView('explore')} className="text-xs font-bold text-[#1877F2] hover:underline">
            عرض الجميع
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => (onSelectCategory ? onSelectCategory(cat.name) : setCurrentView('explore'))}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition duration-200 group bg-white dark:bg-slate-800 shadow-xs hover:shadow-md hover:border-[#1877F2]`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition group-hover:scale-110 ${cat.bg}`}>
                {cat.icon}
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. الشبكة السفلية: الأكثر مبيعاً + متاجر طلابية + بنر العروض */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* الأكثر مبيعاً */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="text-orange-500" size={17} />
                <span>المنتجات الأكثر مبيعاً</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                طلب متزايد
              </span>
            </div>

            <div className="space-y-3">
              {bestSellers.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentView('explore')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 transition cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold block">{item.store}</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                    <span className="text-xs font-black text-[#1877F2] font-mono">{item.price} ر.ع</span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* متاجر طلابية معتمدة */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="text-[#1877F2]" size={18} />
                <span>متاجر الطلاب المعتمدة والمميزة</span>
              </h3>
              <button
                onClick={() => setCurrentView('stores')}
                className="text-xs font-bold text-[#1877F2] hover:underline flex items-center gap-1"
              >
                <span>استكشف كل المتاجر</span>
                <ArrowLeft size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => (onSelectStore ? onSelectStore(store.name) : setCurrentView('stores'))}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 hover:border-[#1877F2] transition cursor-pointer group shadow-2xs"
                >
                  <div className="h-28 rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={store.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-500 flex items-center gap-1 shadow-xs">
                      <Star size={11} className="fill-amber-500" />
                      <span>{store.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <img
                      src={store.logo}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-xs"
                    />
                    <div>
                      <h4 className="font-black text-xs text-slate-900 dark:text-white group-hover:text-[#1877F2] transition">
                        {store.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold">{store.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}