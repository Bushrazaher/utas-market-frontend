import React from 'react';
import { Store, Star, ArrowLeft, CheckCircle, Package } from 'lucide-react';

export default function StoresView({ setCurrentView }) {
  const campusStores = [
    {
      id: 1,
      name: 'مكتبة الطالب الذكي',
      owner: 'سالم المعمري (تقنية معلومات)',
      category: 'كتب ومذكرات',
      rating: '4.9',
      productsCount: 14,
      bio: 'توفير جميع ملخصات ومذكرات كلية تقنية المعلومات والهندسة مطبوعة ومجلدة.'
    },
    {
      id: 2,
      name: 'Artistic Vibes',
      owner: 'مريم الحارثي (تصميم جرافيك)',
      category: 'خدمات طلابية',
      rating: '5.0',
      productsCount: 8,
      bio: 'تصميم عروض تقديمية، شعارات للمشاريع الأكاديمية ورسومات رقمية مخصصة.'
    },
    {
      id: 3,
      name: 'سناك الحرم الجامعي',
      owner: 'أحمد البلوشي (إدارة أعمال)',
      category: 'مأكولات ومشروبات',
      rating: '4.8',
      productsCount: 6,
      bio: 'ساندوتشات كوكيز وقهوة مختصة محضرة يومياً للطلاب أثناء فترات الاستراحة.'
    },
    {
      id: 4,
      name: 'متجر الحلول الهندسية',
      owner: 'خالد المقبالي (هندسة)',
      category: 'إلكترونيات وأدوات',
      rating: '4.7',
      productsCount: 11,
      bio: 'حساسات، بوردات أردوينو ولوازم مشاريع التخرج التقنية بأسعار طلابية.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir="rtl">
      
      {/* البنر الموحد */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#1493d8]">
            <Store size={14} />
            <span>مشاريع ومتاجر الطلاب</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            متاجر الحرم الجامعي <br />
            <span className="text-[#1493d8]">في UTAS Market</span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-1">
            ادعم المشاريع الطلابية واكتشف المتاجر المسجلة والمعتمدة داخل الجامعة.
          </p>
        </div>
      </section>

      {/* شبكة المتاجر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campusStores.map((store) => (
          <div 
            key={store.id} 
            className="tactile-card bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#1493d8] flex items-center justify-center font-black">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                      <span>{store.name}</span>
                      <CheckCircle size={14} className="text-[#1493d8]" />
                    </h3>
                    <span className="text-xs text-slate-400">{store.owner}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl text-xs font-black">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{store.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-3">
                {store.bio}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Package size={13} className="text-[#1493d8]" />
                <span>{store.productsCount} منتج معروض</span>
              </span>

              <button
                onClick={() => setCurrentView('explore')}
                className="tactile-btn bg-black hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
              >
                <span>زيارة المتجر</span>
                <ArrowLeft size={13} className="rtl:-scale-x-100 text-[#1493d8]" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}