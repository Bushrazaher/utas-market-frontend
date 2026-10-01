import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar'; // شريط الإعلانات التفاعلي الجديد
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import CategoriesView from './components/CategoriesView';
import StoresView from './components/StoresView';
import StoreDetailsView from './components/StoreDetailsView';
import ProductDetailsView from './components/ProductDetailsView';
import SavedItemsView from './components/SavedItemsView'; //[cite: 4]
import SettingsView from './components/SettingsView'; //[cite: 6]
import SellerDashboard from './components/SellerDashboard'; //[cite: 5]
import AdminView from './components/AdminView';
import CartView from './components/CartView';
import OrdersView from './components/OrdersView';
import ProfileView from './components/ProfileView';
import NotificationsView from './components/NotificationsView';
import AuthView from './components/AuthView';
import NasrAiWidget from './components/NasrAiWidget';
import AiAgentView from './components/AiAgentView';
import { API_URL } from './config';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [selectedStore, setSelectedStore] = useState(null); 
  const [activeStoreObject, setActiveStoreObject] = useState(null); 
  const [activeProduct, setActiveProduct] = useState(null); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('utas_cart') || '[]'));
  const [savedItems, setSavedItems] = useState(() => JSON.parse(localStorage.getItem('utas_saved') || '[]'));
  const [stores, setStores] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('utas_theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('utas_lang') || 'ar');

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('utas_user');
    return saved ? JSON.parse(saved) : { isLoggedIn: false, role: 'guest' };
  });

  const navigateSafely = (newView) => {
    if (newView !== currentView) {
      setViewHistory((prev) => [...prev, currentView]);
      setCurrentView(newView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(prevView);
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetails = (product) => {
    setActiveProduct(product);
    navigateSafely('product-details');
  };

  const handleOpenStoreProfile = (storeObj) => {
    setActiveStoreObject(storeObj);
    navigateSafely('store-details');
  };

  const handleLogout = () => {
    const guest = { isLoggedIn: false, role: 'guest' };
    setCurrentUser(guest);
    localStorage.removeItem('utas_user');
    setViewHistory(['home']);
    setCurrentView('home');
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => (item._id || item.id) === (product._id || product.id));
      if (exists) {
        return prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleToggleSave = (product) => {
    const pId = product._id || product.id;
    setSavedItems((prev) => {
      const isSaved = prev.some((item) => (item._id || item.id) === pId);
      if (isSaved) return prev.filter((item) => (item._id || item.id) !== pId);
      return [...prev, product];
    });
  };

  const handleRemoveSaved = (productId) => {
    setSavedItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('utas_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('utas_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('utas_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('utas_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    fetch(`${API_URL}/api/stores`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setStores)
      .catch(() => setStores([]));
  }, []);

  const canGoBack = viewHistory.length > 1;

  // ==========================================
  // 1. لوحة تحكم المشرف (Admin) المستقلة بالكامل
  // ==========================================
  if (currentView === 'admin') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f19] text-white' : 'bg-slate-50 text-slate-950'}`} dir={language === 'en' ? 'ltr' : 'rtl'}>
        <AdminView 
          currentUser={currentUser} 
          setCurrentView={navigateSafely} 
          onBack={handleGoBack} 
          language={language} 
          theme={theme} 
        />
      </div>
    );
  }

  // ==========================================
  // 2. لوحة تحكم التاجر / البائع المستقلة بالكامل[cite: 5]
  // ==========================================
  if (currentView === 'seller') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f19] text-white' : 'bg-slate-50 text-slate-950'}`} dir={language === 'en' ? 'ltr' : 'rtl'}>
        <SellerDashboard
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setCurrentView={navigateSafely}
          onBack={handleGoBack}
          language={language}
          theme={theme}
        />
      </div>
    );
  }

  // ==========================================
  // 3. الواجهة الأساسية للمشتري والزوار
  // ==========================================
  return (
    <div 
      className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f19] text-white' : 'bg-slate-50 text-slate-950'}`}
      dir={language === 'en' ? 'ltr' : 'rtl'}
    >
      {/* شريط الإعلانات العلوي المتحرك (مستوحى من سلة) */}
      <AnnouncementBar language={language} />

      <TopBar
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'explore') {
            setSelectedStore(null);
          }
          navigateSafely(view);
        }}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        savedCount={savedItems.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onLogout={handleLogout}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={navigateSafely}
          currentUser={currentUser}
          language={language}
          theme={theme}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-24 md:pb-12 w-full">
          {currentView === 'home' && (
            <HomeView setCurrentView={navigateSafely} language={language} theme={theme} stores={stores} />
          )}

          {currentView === 'explore' && (
            <ExploreView
              setCurrentView={navigateSafely}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              savedItems={savedItems}
              onToggleSave={handleToggleSave}
              onSelectProduct={handleOpenProductDetails}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'product-details' && (
            <ProductDetailsView
              product={activeProduct}
              onAddToCart={handleAddToCart}
              savedItems={savedItems}
              onToggleSave={handleToggleSave}
              setCurrentView={navigateSafely}
              setSelectedStore={setSelectedStore}
              language={language}
            />
          )}

          {currentView === 'saved' && (
            <SavedItemsView
              savedItems={savedItems}
              onRemoveSaved={handleRemoveSaved}
              onAddToCart={handleAddToCart}
              setCurrentView={navigateSafely}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
            />
          )}

          {currentView === 'stores' && (
            <StoresView 
              setCurrentView={navigateSafely} 
              onSelectStore={handleOpenStoreProfile}
              onBack={handleGoBack} 
              language={language} 
              theme={theme} 
            />
          )}

          {currentView === 'store-details' && (
            <StoreDetailsView
              store={activeStoreObject}
              onAddToCart={handleAddToCart}
              savedItems={savedItems}
              onToggleSave={handleToggleSave}
              setCurrentView={navigateSafely}
              onSelectProduct={handleOpenProductDetails}
              onBack={handleGoBack}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'categories' && (
            <CategoriesView 
              setCurrentView={navigateSafely} 
              onAddToCart={handleAddToCart} 
              onSelectProduct={handleOpenProductDetails} 
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              setCurrentView={navigateSafely}
              onLogout={handleLogout}
              onBack={handleGoBack}
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'cart' && (
            <CartView 
              cartItems={cart} 
              setCartItems={setCart} 
              currentUser={currentUser} 
              setCurrentView={navigateSafely} 
              onBack={handleGoBack} 
            />
          )}

          {currentView === 'orders' && (
            <OrdersView 
              currentUser={currentUser} 
              setCurrentView={navigateSafely} 
              onBack={handleGoBack} 
              language={language}
              theme={theme}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView 
              currentUser={currentUser} 
              setCurrentView={navigateSafely} 
              onBack={handleGoBack} 
              language={language} 
              theme={theme} 
            />
          )}

          {currentView === 'ai-agent' && (
            <AiAgentView 
              setCurrentView={navigateSafely} 
              onBack={handleGoBack} 
              language={language} 
              theme={theme} 
            />
          )}

          {currentView === 'auth' && (
            <AuthView
              setCurrentView={navigateSafely}
              setCurrentUser={setCurrentUser}
            />
          )}
        </main>
      </div>

      <BottomNav 
        currentView={currentView} 
        setCurrentView={navigateSafely} 
        currentUser={currentUser} 
        language={language} 
        theme={theme} 
      />
      <NasrAiWidget 
        setCurrentView={navigateSafely} 
        onAddToCart={handleAddToCart} 
        currentUser={currentUser}
        cart={cart}
      />
    </div>
  );
}