import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { db } from './services/db';
import { Navbar } from './components/Navbar';
import { HeroFullscreen } from './components/HeroFullscreen';
import { StoryCarousel } from './components/StoryCarousel';
import { ProductGrid } from './components/ProductGrid';
import { CustomBouquetBuilder } from './components/CustomBouquetBuilder';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MobileAppTabBar } from './components/MobileAppTabBar';
import { ChatbotWidget } from './components/ChatbotWidget';
import { CrmModal } from './components/CrmModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CraftInfoBanner } from './components/CraftInfoBanner';
import { OrderStepsSection } from './components/OrderStepsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';
import { Sparkles, PackageSearch } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Dynamic Product Catalog State connected to Database
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Load Database Products on Initial Mount & Listen for Real-Time Catalog Updates
  useEffect(() => {
    async function loadDbProducts() {
      const prods = await db.getProducts();
      setProductsList(prods);
    }
    loadDbProducts();

    const handleCatalogChanged = (e: any) => {
      if (e.detail) {
        setProductsList(e.detail);
      }
    };

    window.addEventListener('isaflores_catalog_changed', handleCatalogChanged);
    return () => window.removeEventListener('isaflores_catalog_changed', handleCatalogChanged);
  }, []);

  // PWA Automatic Installation Prompt Trigger
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert(
        'Para instalar la App de IsaFlores en tu celular o computador:\n\n' +
        '• En iPhone/iPad (Safari): Presiona el botón "Compartir" 📤 y selecciona "Agregar a la pantalla de inicio" 📲.\n' +
        '• En Android (Chrome): Presiona los tres puntos verticales en la esquina superior derecha y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".\n' +
        '• En Computador (Chrome/Edge): Haz clic en el icono de instalación 💻 en la barra de direcciones superior.'
      );
      setShowInstallBanner(false);
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } catch (e) {
      console.warn('Error launching install prompt:', e);
    }
  };

  // Persistence for Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('isaflores_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('isaflores_wishlist');
      return saved ? JSON.parse(saved) : ['ramo-coral-eterno'];
    } catch {
      return ['ramo-coral-eterno'];
    }
  });

  // Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('isaflores_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('isaflores_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleAddToCart = (product: Product, quantityToAdd = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPage(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const wishlistProducts = productsList.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCatalog = () => {
    const el = document.getElementById('productos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoadingPage) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FDF0F5] flex flex-col items-center justify-center animate-fadeIn">
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <img
              src="/logo.png"
              alt="IsaFlores Loader"
              className="w-32 h-32 rounded-full border-4 border-[#f70071]/30 shadow-2xl animate-pulse object-cover"
            />
            <div className="absolute -inset-2 rounded-full border-4 border-t-[#f70071] border-r-transparent border-b-[#ff96c5] border-l-transparent animate-spin duration-1000" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-syne text-2xl font-black text-[#1A0D18] tracking-wide">
              IsaFlores
            </h1>
            <p className="text-xs font-bold text-[#E91E63] uppercase tracking-widest animate-pulse">
              Recuerdos que perduran...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#1A237E] flex flex-col font-sans pb-16 lg:pb-0">
      
      {/* ARCHITECTURE MODULE 1: Sticky Top Delivery Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
      />

      {/* ARCHITECTURE MODULE 2: Delivery Storefront Body */}
      <main className="flex-1 space-y-4">
        
        {/* Section 1 & 2: Hero Banner Promos & Category Avatars */}
        <HeroFullscreen
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          onExploreCatalog={scrollToCatalog}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section 3: Feature Stories Slider */}
        <StoryCarousel
          onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          onExploreCatalog={scrollToCatalog}
        />

        {/* Section 4: Interactive Custom Bouquet Studio Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-r from-[#00838F] via-[#0288D1] to-[#1A237E] text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#FFC107]" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-white">
                  ¿Quieres un ramo totalmente personalizado?
                </h4>
                <p className="text-xs text-[#E0F7FA]">
                  Selecciona la cantidad, color e icono de cada flor desde $1.200 CLP el tallo.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCustomBuilderOpen(true)}
              className="bg-white hover:bg-[#E0F7FA] text-[#00838F] font-black text-xs uppercase px-6 py-3 rounded-full shadow-md cursor-pointer transition-all shrink-0"
            >
              Abrir Estudio Diseña tu Ramo
            </button>
          </div>
        </div>

        {/* Section 5: Delivery Products Grid (Dynamic Catalog) */}
        <ProductGrid
          products={productsList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={(product) => setQuickViewProduct(product)}
          onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        />

        {/* Section 6: Real-Time Order Tracking Quick Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
          <div className="bg-white p-6 rounded-3xl border border-cyan-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00838F]/10 text-[#00838F] flex items-center justify-center shrink-0">
                <PackageSearch className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#1A237E]">
                  ¿Ya realizaste tu pedido? Sigue el estado en tiempo real
                </h4>
                <p className="text-xs text-cyan-900/60 font-medium">
                  Ingresa tu número de orden para escanear si está en elaboración en taller o despachado.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="bg-[#C2185B] hover:bg-[#8E24AA] text-white font-black text-xs uppercase px-6 py-3 rounded-full shadow-md cursor-pointer transition-all shrink-0"
            >
              🔍 Rastrear Mi Orden
            </button>
          </div>
        </div>

        {/* Section 7: Quality Value Pillars */}
        <CraftInfoBanner />

        {/* Section 8: Delivery Purchase Guide */}
        <OrderStepsSection />

        {/* Section 9: Customer Reviews */}
        <ReviewsSection />

        {/* Section 10: FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* ARCHITECTURE MODULE 3: Store Footer */}
      <Footer onOpenCrm={() => setIsCrmOpen(true)} />

      {/* ARCHITECTURE MODULE 4: WhatsApp Chatbot Floating Launcher */}
      <ChatbotWidget />

      {/* ARCHITECTURE MODULE 5: Mobile Web App Bottom Navigation Bar */}
      <MobileAppTabBar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onScrollToTop={scrollToTop}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* ARCHITECTURE MODULE 6: Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      {/* ARCHITECTURE MODULE 7: CRM & Database Panel */}
      <CrmModal
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
        onUpdateProductCatalog={(newCatalog) => setProductsList(newCatalog)}
      />

      {/* ARCHITECTURE MODULE 8: Custom Bouquet Studio */}
      <CustomBouquetBuilder
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
      />

      {/* ARCHITECTURE MODULE 9: Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* ARCHITECTURE MODULE 10: Cart & Checkout Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => {
          handleAddToCart(p);
          setIsWishlistOpen(false);
        }}
      />

      {showInstallBanner && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-50 bg-[#2B051C]/95 backdrop-blur-md border-2 border-[#f70071]/40 rounded-3xl p-5 shadow-2xl animate-slideUp text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f70071] flex items-center justify-center shrink-0 shadow-lg">
              <img src="/logo.png" alt="IsaFlores Mini Logo" className="w-10 h-10 rounded-full object-cover" />
            </div>
            <div className="flex-1 space-y-1.5 text-left">
              <h4 className="font-syne text-sm font-black text-white">📲 Instala la App de IsaFlores</h4>
              <p className="text-[11px] font-bold text-[#ff96c5]/90 leading-relaxed">
                Accede al catálogo al instante, personaliza tu ramo y sigue tu cotización sin abrir el navegador.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={handleInstallApp}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  Instalar ahora
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="bg-white/10 hover:bg-white/20 text-white/80 text-[10px] font-black uppercase px-3 py-2 rounded-full cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
