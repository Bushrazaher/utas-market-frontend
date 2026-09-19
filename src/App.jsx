import React, { useState, useEffect, useCallback } from 'react';
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

  // 1. اللغة والمظهر
  const [language, setLanguage] = useState(() => localStorage.getItem('utas_lang') || 'ar');
  const [theme, setTheme] = useState(() => localStorage.getItem('utas_theme') || 'light');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [language, theme]);

  // 2. إدارة جلسة المستخدم
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
      storeStatus: 'none',
      isStoreConfigured: false
    };
  });

  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

  // 3. جلب المتاجر والمنتجات والطلبات
  const fetchAllData = useCallback(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});

    fetch(`${API_URL}/api/orders`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {});

    fetch(`${API_URL}/api/stores`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setStores(data); })
      .catch(() => {});
  }, []);

  // 4. مزامنة بيانات حساب التاجر مع قاعدة البيانات
  const refreshUserProfile = useCallback(async () => {
    if (!currentUser?.isLoggedIn || !currentUser?.email) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/profile/${currentUser.email}`);
      if (res.ok) {
        const freshData = await res.json();
        
        // التحقق إن كانت هناك ترقية أو تغيير في حالة المتجر
        if (
          freshData.storeStatus !== currentUser.storeStatus || 
          freshData.role !== currentUser.role || 
          freshData.isStoreConfigured !== currentUser.isStoreConfigured
        ) {
          const updatedUser = {
            ...currentUser,
            role: freshData.role,
            storeName: freshData.storeName,
            storeStatus: freshData.storeStatus,
            isStoreConfigured: freshData.isStoreConfigured
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('utas_user', JSON.stringify(updatedUser));
          fetchAllData(); // تحديث المتاجر المعروضة فوراً
        }
      }
    } catch (err) {
      console.error('تعذر مزامنة الملف الشخصي:', err);
    }
  }, [currentUser, fetchAllData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // فحص تلقائي كل 8 ثوانٍ في حال كان المتجر قيد المراجعة لمزامنته لحظياً
  useEffect(() => {
    if (currentUser?.isLoggedIn && currentUser?.storeStatus === 'pending') {
      const timer = setInterval(() => {
        refreshUserProfile();
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [currentUser, refreshUserProfile]);

  const handleLogout = () => {
    localStorage.removeItem('utas_token');
    localStorage.removeItem('utas_user');
    setCurrentUser({
      isLoggedIn: false,
      name: '',
      email: '',
      role: 'buyer',
      storeName: '',
      storeStatus: 'none',
      isStoreConfigured: false
    });
    setCurrentView('home');
  };

  const navigateSafely = (targetView) => {
    if (targetView === 'seller') {
      if (!currentUser.isLoggedIn) {
        alert(language === 'en' ? 'Please log in to access Seller Studio.' : 'يجب تسجيل الدخول أولاً بحسابك الجامعي.');
        setCurrentView('auth');
        return;
      }
      if (currentUser.role !== 'seller' && currentUser.role !== 'admin' && currentUser.storeStatus !== 'pending') {
        alert(language === 'en' ? 'Your account is currently a buyer account.' : 'حسابك مسجل حالياً كطالب مشتري.');
        return;
      }
    }

    if (targetView === 'admin' && currentUser.role !== 'admin') {
      alert(language === 'en' ? 'Unauthorized access.' : 'غير مصرح لك بدخول لوحة الإشراف.');
      return;
    }

    setCurrentView(targetView);
  };

  const addToCart = (product) => {
    if (!product) return;
    const numericPrice = typeof product.price === 'string'
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

      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
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
       
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {currentView === 'home' && (
            <HomeView 
              stores={stores}
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
              onRefreshUser={refreshUserProfile}
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