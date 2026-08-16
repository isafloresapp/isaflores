import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Eye, Plus, Star, Flame, Clock, Bike, Snowflake, ArrowRight, Sparkles, Layers, Check, Grid, List, SlidersHorizontal, ArrowUpDown, ShoppingBag, Gift, Truck } from 'lucide-react';
import heroBouquetImg from '../assets/images/hero_pipe_cleaner_bouquet_1786069749958.jpg';
import girasolesImg from '../assets/images/girasoles_limpiapipas_1786069760102.jpg';
import kitDiyImg from '../assets/images/kit_diy_limpiapipas_1786069771911.jpg';
import heroArtImg from '../assets/images/hero_art.jpg';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  onQuickView: (product: Product) => void;
  onOpenCustomBuilder: () => void;
}

const CATEGORY_AVATARS = [
  {
    id: 'todos',
    label: 'Todas las Flores',
    icon: '✨',
    image: heroBouquetImg,
    badge: 'Ver Todo',
  },
  {
    id: 'flores-temporada',
    label: 'Flores Temporada',
    icon: '🌺',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
    badge: 'Tendencia',
  },
  {
    id: 'ramos',
    label: 'Ramos Eternos',
    icon: '💐',
    image: heroBouquetImg,
    badge: 'Insignia',
  },
  {
    id: 'girasoles',
    label: 'Girasoles',
    icon: '🌻',
    image: girasolesImg,
    badge: 'Favoritos',
  },
  {
    id: 'bodas',
    label: 'Bodas & Novias',
    icon: '💍',
    image: heroArtImg,
    badge: 'Elegante',
  },
  {
    id: 'kits',
    label: 'Kits DIY',
    icon: '🎨',
    image: kitDiyImg,
    badge: 'Manualidades',
  },
  {
    id: 'regalos',
    label: 'Regalos',
    icon: '🎁',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    badge: 'Sorpresas',
  },
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenCustomBuilder,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const topRatedProducts = products.filter((p) => p.rating >= 4.9).slice(0, 3);
  const activeCatObj = CATEGORY_AVATARS.find((c) => c.id === selectedCategory) || CATEGORY_AVATARS[0];

  const handleAddWithFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-[#FDF0F5] text-[#1A237E]" id="productos">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 text-left space-y-6 sm:space-y-10">

        {/* SECTION HEADER & LUXURY CATEGORY STORIES CAROUSEL */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#f70071]/15 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#f70071]/10 text-[#f70071] px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f70071]" />
                <span>Vitrina Exclusiva · Taller IsaFlores</span>
              </div>
              <h2 className="font-syne text-2xl sm:text-4xl font-black text-[#2B051C] leading-tight">
                Colección de Flores Eternas
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCustomBuilder}
                className="bg-gradient-to-r from-[#2B051C] to-[#42082B] hover:from-[#42082B] hover:to-[#2B051C] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffc0dc]" />
                <span>Diseña tu Ramo a Medida</span>
              </button>
            </div>
          </div>

          {/* Category Avatar Highlights */}
          <div className="relative">
            <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar py-1">
              {CATEGORY_AVATARS.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer text-center outline-none"
                  >
                    <div
                      className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#f70071] via-[#ff1b82] to-[#8E24AA] shadow-lg ring-4 ring-[#f70071]/25 scale-105'
                          : 'bg-white border-2 border-pink-200 group-hover:border-[#f70071]'
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden relative bg-pink-50">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <span className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-xs flex items-center justify-center shadow-md border border-pink-100">
                        {cat.icon}
                      </span>
                    </div>

                    <div className="space-y-0.5 max-w-[85px] sm:max-w-[105px]">
                      <span
                        className={`text-[11px] sm:text-xs font-black block truncate transition-colors ${
                          isSelected ? 'text-[#f70071]' : 'text-[#2B051C]'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* VITRINA DESTACADA "LOS MÁS PEDIDOS ESTA SEMANA" */}
        {selectedCategory === 'todos' && !searchQuery && (
          <div className="bg-gradient-to-r from-[#2B051C] via-[#3D0A2A] to-[#2B051C] rounded-3xl p-4 sm:p-7 border-2 border-white/20 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#ff5aa4] fill-[#ff5aa4] animate-pulse" />
                <h3 className="font-syne font-black text-lg sm:text-2xl text-white">
                  Vitrina Estelar: Los Más Pedidos de la Semana
                </h3>
              </div>
              <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                🎉 Envío Gratis La Florida
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topRatedProducts.map((p) => {
                const pImage = p.image || (p as any).images?.[0];
                const isJustAdded = addedIds.includes(p.id);

                return (
                  <div
                    key={`showcase-${p.id}`}
                    onClick={() => onQuickView(p)}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 shadow-lg hover:bg-white/15 transition-all cursor-pointer group flex gap-3 text-left relative overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/20">
                      <img
                        src={pImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <span className="absolute top-1 left-1 bg-[#f70071] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                        🔥 Top 1
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-1">
                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-amber-300">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{p.rating} / 5.0</span>
                        </div>
                        <h4 className="font-syne font-black text-xs sm:text-sm text-white group-hover:text-[#ffc0dc] transition-colors leading-snug line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-white/80 line-clamp-1 font-medium">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-1 flex items-center justify-between border-t border-white/10">
                        <span className="font-syne font-black text-sm text-[#ff96c5]">
                          ${p.price.toLocaleString('es-CL')} <span className="text-[9px] font-normal text-white/70">CLP</span>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddWithFeedback(p);
                          }}
                          className={`px-3 py-1 rounded-full font-black text-[10px] uppercase flex items-center gap-1 shadow-md transition-all ${
                            isJustAdded
                              ? 'bg-[#25D366] text-white'
                              : 'bg-[#f70071] hover:bg-[#ff1b82] text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>¡Añadido!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 stroke-[3]" />
                              <span>Añadir</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* E-COMMERCE TOOLBAR: CATEGORY HEADER, SORT & VIEW SWITCHER */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FDF0F5] text-[#f70071] flex items-center justify-center text-lg sm:text-xl font-bold border border-pink-200">
              {activeCatObj.icon}
            </span>
            <div>
              <h3 className="font-syne text-base sm:text-xl font-black text-[#2B051C] flex items-center gap-2">
                <span>{activeCatObj.label}</span>
                <span className="text-[10px] sm:text-xs font-bold bg-[#FDF0F5] text-[#f70071] px-2.5 py-0.5 rounded-full border border-pink-200">
                  {sortedProducts.length} opciones
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-[#FDF0F5] px-3 py-1.5 rounded-xl border border-pink-200 text-[11px] font-bold text-[#2B051C]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#f70071]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold text-[#2B051C]"
              >
                <option value="featured">🔥 Recomendados</option>
                <option value="price_asc">💵 Menor Precio</option>
                <option value="price_desc">💎 Mayor Precio</option>
                <option value="rating">⭐ Mejor Valorados</option>
              </select>
            </div>

            <div className="flex items-center bg-[#FDF0F5] p-1 rounded-xl border border-pink-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#f70071] text-white shadow-xs' : 'text-gray-500'
                }`}
                title="Vista en Rejilla"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#f70071] text-white shadow-xs' : 'text-gray-500'
                }`}
                title="Vista en Lista"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS CATALOG GRID (2 COLUMNAS EN MÓVIL, 3 EN DESKTOP) */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-pink-100 space-y-3 max-w-md mx-auto shadow-sm">
            <span className="text-3xl block">🌸</span>
            <h4 className="font-syne text-lg font-bold text-[#2B051C]">No se encontraron ramos</h4>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="bg-[#f70071] text-white font-black text-xs uppercase px-6 py-2.5 rounded-full shadow-md"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6' : 'space-y-3'}>
            {sortedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isJustAdded = addedIds.includes(product.id);
              const productImage =
                product.image ||
                (product as any).images?.[0] ||
                'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

              if (viewMode === 'list') {
                return (
                  <div
                    key={product.id}
                    onClick={() => onQuickView(product)}
                    className="bg-white rounded-2xl p-3 sm:p-4 border border-pink-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row justify-between gap-3 text-left relative"
                  >
                    <div className="relative w-full sm:w-40 h-36 sm:h-32 rounded-xl overflow-hidden bg-[#FDF0F5] shrink-0">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-[#2B051C]/90 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                        ⭐ {product.rating}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-1">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#f70071] block">
                          {product.categoryLabel || product.category}
                        </span>
                        <h4 className="font-syne font-black text-sm sm:text-lg text-[#2B051C] group-hover:text-[#f70071] transition-colors leading-snug">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                        <div>
                          <span className="font-syne font-black text-lg text-[#f70071] block">
                            ${product.price.toLocaleString('es-CL')} CLP
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold block">
                            🎉 Envío Gratis La Florida
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist(product);
                            }}
                            className={`p-2 rounded-xl border transition-all ${
                              isWishlisted ? 'bg-[#f70071] text-white border-[#f70071]' : 'bg-gray-50 text-gray-400'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddWithFeedback(product);
                            }}
                            className={`font-black text-[11px] uppercase px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all text-white ${
                              isJustAdded ? 'bg-[#25D366]' : 'bg-gradient-to-r from-[#f70071] to-[#ff1b82]'
                            }`}
                          >
                            {isJustAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
                            <span>{isJustAdded ? '¡Añadido!' : 'Añadir al Pedido'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              /* GRID VIEW: HIGH-END TENTADORA VITRINA CARD */
              return (
                <div
                  key={product.id}
                  onClick={() => onQuickView(product)}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-pink-100/90 shadow-xs hover:shadow-xl hover:border-[#f70071]/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative transform hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-square sm:aspect-4/3 overflow-hidden bg-[#FDF0F5]">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                      <span className="bg-white/95 backdrop-blur-md text-[#2B051C] text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 border border-pink-100">
                        <Star className="w-3 h-3 fill-[#F4C24C] text-[#F4C24C]" />
                        <span>{product.rating}</span>
                      </span>

                      <span className="bg-[#2B051C]/90 text-[#ffc0dc] text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        {product.badge || 'Nuevo'}
                      </span>
                    </div>

                    {/* Wishlist Heart Top Right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md shadow-xs transition-all z-10 cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#f70071] text-white border border-[#f70071]'
                          : 'bg-white/90 text-gray-400 hover:text-[#f70071] border border-pink-100'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Quick Hover Action overlay */}
                    <div className="absolute bottom-2 left-2 right-2 hidden sm:flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <span className="bg-white/95 text-[#2B051C] text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#f70071]" />
                        <span>Ver Detalle</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Details */}
                  <div className="p-3 sm:p-5 space-y-2 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-0.5">
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-[#f70071] block truncate">
                        {product.categoryLabel || product.category}
                      </span>
                      <h4 className="font-syne font-black text-xs sm:text-base text-[#2B051C] group-hover:text-[#f70071] transition-colors leading-snug line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium line-clamp-2 leading-snug hidden sm:block">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-pink-100 flex items-end sm:items-center justify-between gap-1">
                      <div>
                        <span className="font-syne font-black text-sm sm:text-xl text-[#f70071] block leading-none">
                          ${product.price.toLocaleString('es-CL')} <span className="text-[8px] sm:text-xs font-semibold text-gray-400">CLP</span>
                        </span>
                        <span className="text-[8px] sm:text-[10px] text-emerald-600 font-bold block truncate">
                          🎉 Gratis La Florida
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddWithFeedback(product);
                        }}
                        className={`p-2 sm:px-4 sm:py-2.5 rounded-xl shadow-md font-black text-xs uppercase transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 text-white ${
                          isJustAdded
                            ? 'bg-[#25D366]'
                            : 'bg-gradient-to-r from-[#f70071] to-[#ff1b82] hover:from-[#ff1b82] hover:to-[#f70071]'
                        }`}
                        title="Añadir al pedido"
                      >
                        {isJustAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
                        <span className="hidden sm:inline">{isJustAdded ? '¡Añadido!' : 'Añadir'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
