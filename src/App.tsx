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
    <div className="min-h-screen bg-white text-[#1A0D18] flex flex-col font-sans pb-16 lg:pb-0">
      {/* Fullscreen Video Hero */}
      <HeroFullscreen
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onExploreCatalog={scrollToCatalog}
        onSelectCategory={setSelectedCategory}
      />

      {/* Sticky Quick Storefront Sub-Navbar */}
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

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Feature & Story Carousel */}
        <StoryCarousel
          onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          onExploreCatalog={scrollToCatalog}
        />

        {/* Product Catalog Grid */}
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

        {/* Brand Value Pillars */}
        <CraftInfoBanner />

        {/* Step-by-Step Purchase Guide */}
        <OrderStepsSection />

        {/* Verified Customer Reviews */}
        <ReviewsSection />

        {/* FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* Footer */}
      <Footer onOpenCrm={() => setIsCrmOpen(true)} />

      {/* Interactive Concierge Chatbot Widget */}
      <ChatbotWidget />

      {/* Mobile Web App Bottom Navigation Tab Bar */}
      <MobileAppTabBar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onScrollToTop={scrollToTop}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Customer Real-Time Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      {/* Internal CRM Management & Database Layer Modal */}
      <CrmModal
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
        onUpdateProductCatalog={(newCatalog) => setProductsList(newCatalog)}
      />

      {/* Custom Bouquet Studio Modal */}
      <CustomBouquetBuilder
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
      />

      {/* Quick Product View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Quotation Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
      />

      {/* Wishlist Slide-over Drawer */}
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
