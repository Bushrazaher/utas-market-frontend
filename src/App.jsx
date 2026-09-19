import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import CategoriesView from './components/CategoriesView';
import StoresView from './components/StoresView';
import SellerDashboard from './components/SellerDashboard';
import AiAgentView from './components/AiAgentView';
import OrdersView from './components/OrdersView';
import SavedItemsView from './components/SavedItemsView';
import NotificationsView from './components/NotificationsView';
import AdminView from './components/AdminView';
import AuthView from './components/AuthView';
import CartView from './components/CartView';
import NasrAiWidget from './components/NasrAiWidget';
import SettingsView from './components/SettingsView';
import { API_URL } from './config';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. إدارة اللغة والمظهر العام مع التخزين المحلي
  const [language, setLanguage] = useState(() => localStorage.getItem('utas_lang') || 'ar');
  const [theme, setTheme] = useState(() => localStorage.getItem('utas_theme') || 'light');

  // مزامنة اتجاه الصفحة وفئات الـ Dark Mode في الـ HTML
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, theme]);

  // 2. إدارة بيانات المستخدم وجلسة الدخول
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('utas_user');
      const token = localStorage.getItem('utas_token');
      if (savedUser && token) {
        return { isLoggedIn: true, ...JSON.parse(savedUser) };
      }
    } catch (err) {
      console.error('خطأ في قراءة بيانات الجلسة:', err);
    }
    return {
      isLoggedIn: false,
      name: '',
      email: '',
      role: 'buyer',
      storeName: '',
      isStoreConfigured: false
    };
  });

  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  // 3. جلب البيانات من السيرفر
  const fetchAllData = () => {
    // جلب المنتجات
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});

    // جلب الطلبات
    fetch(`${API_URL}/api/orders`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {});

    // جلب المتاجر المعتمدة
    fetch(`${API_URL}/api/stores`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStores(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // تسجيل الخروج والعودة المباشرة للصفحة الرئيسية
  const handleLogout = () => {
    localStorage.removeItem('utas_token');
    localStorage.removeItem('utas_user');
    setCurrentUser({
      isLoggedIn: false,
      name: '',
      email: '',
      role: 'buyer',
      storeName: '',
      isStoreConfigured: false
    });
    setCurrentView('home');
  };

  // حماية التوجيه والصلاحيات
  const navigateSafely = (targetView) => {
    if (targetView === 'seller') {
      if (!currentUser.isLoggedIn) {
        alert(language === 'en' ? 'Please log in with your university account to access Seller Studio.' : 'يجب تسجيل الدخول أولاً بحسابك الجامعي للوصول إلى استوديو البائع.');
        setCurrentView('auth');
        return;
      }
      if (currentUser.role !== 'seller' && currentUser.role !== 'admin') {
        alert(language === 'en' ? 'Your account is registered as a buyer. Please create a seller account.' : 'حسابك الحالي مخصص للشراء فقط. يمكنك إنشاء حساب جديد كتاجر.');
        return;
      }
    }

    if (targetView === 'admin' && currentUser.role !== 'admin') {
      alert(language === 'en' ? 'Unauthorized access to the Admin Dashboard.' : 'غير مصرح لك بدخول لوحة الإشراف الجامعية.');
      return;
    }

    setCurrentView(targetView);
  };

  const addToCart = (product) => {
    if (!product) return;

    const numericPrice =
      typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0
        : Number(product.price) || 0;

    setCartItems((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product._id || product.id || Date.now(),
          title: product.title || 'منتج جامعي',
          store: product.store || 'متجر طلابي',
          sellerEmail: product.sellerEmail || null,
          price: numericPrice,
          quantity: 1,
          image: product.image || null
        }
      ];
    });
  };

  const toggleSaveItem = (product) => {
    setSavedItems((prev) => {
      const exists = prev.some((item) => (item._id || item.id) === (product._id || product.id));
      return exists
        ? prev.filter((item) => (item._id || item.id) !== (product._id || product.id))
        : [...prev, product];
    });
  };

  const handleCreateOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    fetchAllData();
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const isDark = theme === 'dark';

  return (
    <div 
      className={`flex h-screen font-sans overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-800'
      }`} 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. القائمة الجانبية (Sidebar) */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={navigateSafely} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
        language={language}
        theme={theme}
      />

      {/* 2. منطقة العرض الرئيسية */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* الشريط العلوي الممتد بالكامل */}
        <TopBar 
          currentView={currentView}
          setCurrentView={navigateSafely} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          cartCount={totalCartCount}
          savedCount={savedItems.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onLogout={handleLogout}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
        />
       
        {/* مساحة عرض المحتوى والصفحات */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {currentView === 'home' && (
            <HomeView 
              setCurrentView={navigateSafely} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={addToCart}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'explore' && (
            <ExploreView 
              setCurrentView={navigateSafely} 
              onAddToCart={addToCart} 
              searchQuery={searchQuery}
              savedItems={savedItems}
              onToggleSave={toggleSaveItem}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'categories' && (
            <CategoriesView 
              products={products}
              setCurrentView={navigateSafely} 
              onAddToCart={addToCart} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'stores' && (
            <StoresView 
              stores={stores}
              setCurrentView={navigateSafely} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'seller' && (
            <SellerDashboard 
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setCurrentView={navigateSafely} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'ai-agent' && (
            <AiAgentView 
              onAddToCart={addToCart}
              setCurrentView={navigateSafely}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'orders' && (
            <OrdersView 
              orders={orders} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'saved' && (
            <SavedItemsView 
              savedItems={savedItems}
              onRemoveSaved={(id) => setSavedItems((prev) => prev.filter((i) => (i._id || i.id) !== id))}
              onAddToCart={addToCart}
              setCurrentView={navigateSafely}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView 
              currentUser={currentUser} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'admin' && (
            <AdminView 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser}
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
            />
          )}

          {currentView === 'auth' && (
            <AuthView 
              setCurrentView={navigateSafely}
              setCurrentUser={setCurrentUser} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'cart' && (
            <CartView 
              setCurrentView={navigateSafely} 
              cartItems={cartItems} 
              setCartItems={setCartItems} 
              onCreateOrder={handleCreateOrder}
              currentUser={currentUser}
              language={language}
              theme={theme}
            />
          )}
        </main>
      </div>

      {/* المساعد الذكي نصر العائم */}
      {currentView !== 'admin' && currentUser?.role !== 'admin' && (
        <NasrAiWidget 
          onAddToCart={addToCart} 
          setCurrentView={navigateSafely} 
          language={language}
          theme={theme}
        />
      )}
    </div>
  );
}