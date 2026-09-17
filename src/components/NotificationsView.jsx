import React, { useState } from 'react';
import { Bell, Check, Package, MessageSquare, Info } from 'lucide-react';

export default function NotificationsView() {
  // بيانات وهمية للإشعارات
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'تم شحن طلبك!',
      message: 'تم شحن "سماعات عازلة للضوضاء" وسيتم تسليمها غداً داخل الحرم الجامعي.',
      time: 'منذ ساعتين',
      read: false, // غير مقروء
    },
    {
      id: 2,
      type: 'message',
      title: 'رسالة جديدة من البائع',
      message: 'استوديو الإبداع: "تم الانتهاء من مسودة الشعار، يرجى المراجعة."',
      time: 'منذ 5 ساعات',
      read: false,
    },
    {
      id: 3,
      type: 'system',
      title: 'تحديث في منصة UTAS Market',
      message: 'أضفنا ميزة جديدة! يمكنك الآن استخدام المساعد الذكي للبحث عن المنتجات بسهولة.',
      time: 'منذ يومين',
      read: true, // مقروء
    }
  ]);

  // دالة لتحديد أيقونة ولون الإشعار حسب نوعه
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order': return <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl"><Package size={20} /></div>;
      case 'message': return <div className="bg-green-100 text-green-600 p-2.5 rounded-xl"><MessageSquare size={20} /></div>;
      case 'system': return <div className="bg-purple-100 text-purple-600 p-2.5 rounded-xl"><Info size={20} /></div>;
      default: return <div className="bg-gray-100 text-gray-600 p-2.5 rounded-xl"><Bell size={20} /></div>;
    }
  };

  // دالة لجعل جميع الإشعارات مقروءة
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
  };

  // دالة لحذف إشعار
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto py-8" dir="rtl">
      
      {/* رأس الصفحة مع زر "تحديد الكل كمقروء" */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
            <Bell className="text-blue-600" size={32} />
            الإشعارات
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2.5 py-1 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500">تابع أحدث التحديثات الخاصة بحسابك وطلباتك.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            <Check size={16} />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* قائمة الإشعارات */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 group
                ${notif.read ? 'bg-white border-gray-100 shadow-sm' : 'bg-blue-50/50 border-blue-200 shadow-md'}
              `}
            >
              {/* النقطة الزرقاء التي تدل على الإشعار الجديد */}
              {!notif.read && (
                <div className="absolute top-6 right-3 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}

              {/* الأيقونة */}
              <div className="shrink-0 mr-2">
                {getNotificationIcon(notif.type)}
              </div>

              {/* محتوى الإشعار */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base font-bold ${notif.read ? 'text-gray-800' : 'text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
                    {notif.time}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notif.message}
                </p>
              </div>

              {/* زر الحذف الذي يظهر عند التمرير */}
              <button 
                onClick={() => deleteNotification(notif.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all absolute top-4 left-4"
                title="حذف الإشعار"
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Bell className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-500">ليس لديك أي إشعارات جديدة في الوقت الحالي.</p>
          </div>
        )}
      </div>

    </div>
  );
}