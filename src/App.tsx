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
import { Sparkles, PackageSearch, MessageCircle, Heart, Plus, ShieldCheck, Truck, Zap } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Dynamic Product Catalog State connected to Database
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Load Database Products on Initial Mount
  useEffect(() => {
    async function loadDbProducts() {
      const prods = await db.getProducts();
      setProductsList(prods);
    }
    loadDbProducts();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#1A1A1A] flex flex-col font-sans pb-16 lg:pb-0">
      
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
          <div className="bg-gradient-to-r from-[#EA2840] to-[#D01E35] text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#FFC107]" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-white">
                  ¿Quieres un ramo totalmente personalizado?
                </h4>
                <p className="text-xs text-[#FFEAEA]">
                  Selecciona la cantidad, color e icono de cada flor desde $1.200 CLP el tallo.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCustomBuilderOpen(true)}
              className="bg-white hover:bg-[#FFEAEA] text-[#EA2840] font-black text-xs uppercase px-6 py-3 rounded-full shadow-md cursor-pointer transition-all shrink-0"
            >
              Abrir Estudio Diseña tu Ramo
            </button>
          </div>
        </div>

        {/* Section 5: Delivery Products Grid */}
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
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00A859]/10 text-[#00A859] flex items-center justify-center shrink-0">
                <PackageSearch className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#1A1A1A]">
                  ¿Ya realizaste tu pedido? Sigue el estado en tiempo real
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  Ingresa tu número de orden para escanear si está en elaboración en taller o despachado.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="bg-[#EA2840] hover:bg-[#D01E35] text-white font-black text-xs uppercase px-6 py-3 rounded-full shadow-md cursor-pointer transition-all shrink-0"
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
    </div>
  );
}
