import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Package, 
  CreditCard, 
  Store, 
  ArrowRight 
} from 'lucide-react';

export default function OrdersView({ orders = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'pending') return o.status === 'pending';
    if (filter === 'completed') return o.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8" dir="rtl">
      
      {/* البنر الموحد */}
      <section className="relative overflow-hidden rounded-3xl bg-black text-white p-8 sm:p-12 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1493d8]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3 text-right">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-[#1493d8]">
            <Package size={14} />
            <span>سجل المعاملات والطلبيات</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            طلباتك السابقة <br />
            <span className="text-[#1493d8]">في UTAS Market</span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-1">
            تابع حالة استلام وجباتك أو مذكراتك الأكاديمية وتواصل مع البائع الجامعي بسهولة.
          </p>
        </div>
      </section>

      {/* أزرار فرز الطلبات */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-bold border transition ${
            filter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          جميع الطلبات ({orders.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-bold border transition ${
            filter === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          قيد التجهيز
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`tactile-btn px-4 py-2 rounded-2xl text-xs font-bold border transition ${
            filter === 'completed' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          المكتملة والمسلّمة
        </button>
      </div>

      {/* قائمة الطلبات */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === 'completed';
            return (
              <div 
                key={order.id} 
                className="tactile-card bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{order.id}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      <span>{isCompleted ? 'تم الاستلام بنجاح' : 'جاري إعداد الطلب'}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800">{order.productName}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Store size={13} className="text-[#1493d8]" />
                      <span>{order.store}</span>
                    </span>
                    <span>•</span>
                    <span>{order.date}</span>
                    <span>•</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-base font-black text-slate-900 block">{order.price}</span>
                  <span className="text-[10px] text-slate-400 font-bold">تسليم مباشر بالحرم</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs font-bold">
          لا توجد طلبات تطابق هذا الاختيار.
        </div>
      )}

    </div>
  );
}