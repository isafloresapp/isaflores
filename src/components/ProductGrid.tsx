import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Eye, Plus, Star, Flame, Clock, Bike, Snowflake, ArrowRight, Sparkles, Layers, Check, Grid, List, SlidersHorizontal, ArrowUpDown, ShoppingBag } from 'lucide-react';
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

  const activeCatObj = CATEGORY_AVATARS.find((c) => c.id === selectedCategory) || CATEGORY_AVATARS[0];

  return (
    <section className="py-10 bg-gradient-to-b from-[#FDF0F5] via-[#FFFDFE] to-[#FDF0F5] text-[#1A237E]" id="productos">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-8">

        {/* SECTION HEADER & LUXURY CATEGORY AVATAR STORIES CAROUSEL */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f70071]/15 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#f70071]/10 text-[#f70071] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#f70071]" />
                <span>Catálogo Artesanal de Autor</span>
              </div>
              <h2 className="font-syne text-3xl sm:text-4xl font-black text-[#2B051C] leading-tight">
                Flores Eternas Hechas a Mano
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenCustomBuilder}
                className="bg-[#2B051C] hover:bg-[#42082B] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#ffc0dc]" />
                <span>Diseña tu Ramo Taller</span>
              </button>
            </div>
          </div>

          {/* Luxury Horizontal Story Avatar Category Menu */}
          <div className="relative">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
              {CATEGORY_AVATARS.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer text-center outline-none"
                  >
                    {/* Story Circle Avatar with Glowing Halo */}
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#f70071] via-[#ff1b82] to-[#8E24AA] shadow-lg ring-4 ring-[#f70071]/20'
                          : 'bg-white/80 border-2 border-pink-200 group-hover:border-[#f70071]'
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden relative bg-pink-50">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>

                      {/* Floating Emoji Icon Badge */}
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-sm flex items-center justify-center shadow-md border border-pink-100">
                        {cat.icon}
                      </span>
                    </div>

                    {/* Label & Active Pill Indicator */}
                    <div className="space-y-0.5 max-w-[90px] sm:max-w-[105px]">
                      <span
                        className={`text-xs font-black block truncate transition-colors ${
                          isSelected ? 'text-[#f70071]' : 'text-[#2B051C] group-hover:text-[#f70071]'
                        }`}
                      >
                        {cat.label}
                      </span>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          isSelected
                            ? 'bg-[#f70071] text-white'
                            : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                      >
                        {cat.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* E-COMMERCE TOOLBAR: CATEGORY HEADER, SORT & VIEW SWITCHER */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#FDF0F5] text-[#f70071] flex items-center justify-center text-xl font-bold border border-pink-200">
              {activeCatObj.icon}
            </span>
            <div>
              <h3 className="font-syne text-lg sm:text-xl font-black text-[#2B051C] flex items-center gap-2">
                <span>{activeCatObj.label}</span>
                <span className="text-xs font-bold bg-[#FDF0F5] text-[#f70071] px-2.5 py-0.5 rounded-full border border-pink-200">
                  {sortedProducts.length} flores
                </span>
              </h3>
              <span className="text-xs text-gray-500 font-semibold block">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Colección artesanal en chenille y goma EVA'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[#FDF0F5] px-3.5 py-2 rounded-2xl border border-pink-200 text-xs font-bold text-[#2B051C]">
              <ArrowUpDown className="w-4 h-4 text-[#f70071]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold text-[#2B051C]"
              >
                <option value="featured">🔥 Populares</option>
                <option value="price_asc">💵 Menor Precio</option>
                <option value="price_desc">💎 Mayor Precio</option>
                <option value="rating">⭐ Mejor Valorados</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Compact List */}
            <div className="flex items-center bg-[#FDF0F5] p-1 rounded-2xl border border-pink-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#f70071] text-white shadow-md' : 'text-gray-500 hover:text-[#2B051C]'
                }`}
                title="Vista en Rejilla"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#f70071] text-white shadow-md' : 'text-gray-500 hover:text-[#2B051C]'
                }`}
                title="Vista en Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS CATALOG LISTING (GRID VS LIST VISTA ELEGANTE) */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FDF0F5] text-[#f70071] flex items-center justify-center mx-auto text-3xl">
              🌸
            </div>
            <h4 className="font-syne text-xl font-bold text-[#2B051C]">No se encontraron ramos</h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              No hay flores disponibles en la categoría seleccionada o con ese término de búsqueda.
            </p>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="bg-[#f70071] hover:bg-[#ff1b82] text-white font-black text-xs uppercase px-8 py-3 rounded-full shadow-lg transition-all cursor-pointer"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW: LUXURY E-COMMERCE CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const productImage =
                product.image ||
                (product as any).images?.[0] ||
                'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={product.id}
                  onClick={() => onQuickView(product)}
                  className="bg-white rounded-3xl overflow-hidden border border-pink-100/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between relative transform hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#FDF0F5]">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="bg-white/95 backdrop-blur-md text-[#2B051C] text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-pink-100">
                        <Star className="w-3.5 h-3.5 fill-[#F4C24C] text-[#F4C24C]" />
                        <span>{product.rating}</span>
                      </span>

                      <span className="bg-[#2B051C]/90 text-[#ffc0dc] text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                        {product.badge || 'Nuevo'}
                      </span>
                    </div>

                    {/* Wishlist Heart Top Right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all z-10 cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#f70071] text-white border border-[#f70071]'
                          : 'bg-white/90 text-gray-400 hover:text-[#f70071] border border-pink-100'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Quick Hover Action overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <span className="bg-white/95 text-[#2B051C] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#f70071]" />
                        <span>Ver Detalle</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Details */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#f70071] block">
                        {product.categoryLabel || product.category}
                      </span>
                      <h4 className="font-syne font-black text-lg text-[#2B051C] group-hover:text-[#f70071] transition-colors leading-snug line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
                      <div>
                        <span className="font-syne font-black text-xl text-[#f70071] block">
                          ${product.price.toLocaleString('es-CL')} <span className="text-xs font-semibold text-gray-400">CLP</span>
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          🎉 Despacho Gratis La Florida
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="bg-[#f70071] hover:bg-[#ff1b82] text-white p-3 rounded-2xl shadow-lg transition-all cursor-pointer transform group-hover:scale-105 flex items-center justify-center"
                        title="Añadir a la bolsa"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST VIEW */
          <div className="space-y-4">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const productImage =
                product.image ||
                (product as any).images?.[0] ||
                'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={product.id}
                  onClick={() => onQuickView(product)}
                  className="bg-white rounded-3xl p-4 border border-pink-100 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col sm:flex-row justify-between gap-4 text-left relative"
                >
                  <div className="relative w-full sm:w-44 h-40 sm:h-36 rounded-2xl overflow-hidden bg-[#FDF0F5] shrink-0">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-[#2B051C]/90 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      ⭐ {product.rating}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#f70071] block">
                        {product.categoryLabel || product.category}
                      </span>
                      <h4 className="font-syne font-black text-xl text-[#2B051C] group-hover:text-[#f70071] transition-colors leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                      <div>
                        <span className="font-syne font-black text-2xl text-[#f70071] block">
                          ${product.price.toLocaleString('es-CL')} CLP
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          🎉 Despacho Gratis La Florida
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          className={`p-3 rounded-2xl border transition-all ${
                            isWishlisted
                              ? 'bg-[#f70071] text-white border-[#f70071]'
                              : 'bg-gray-50 text-gray-400 hover:text-[#f70071] border-gray-200'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Añadir al Pedido</span>
                        </button>
                      </div>
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
