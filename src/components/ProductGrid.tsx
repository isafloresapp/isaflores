import React from 'react';
import { Product } from '../types';
import { Heart, Eye, Plus, Star, Flame, Clock, Bike, Snowflake, ArrowRight, Sparkles, Layers, Check } from 'lucide-react';
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

const CATEGORY_IMAGE_MENU = [
  {
    id: 'flores-temporada',
    label: 'Flores Temporada',
    subtitle: 'Rosas, Liliums, Tulipanes & Girasoles',
    badge: '🔥 Tendencia',
    icon: '🌺',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
    gradient: 'from-[#f70071]/85 to-[#2B051C]/90',
  },
  {
    id: 'ramos',
    label: 'Ramos Eternos',
    subtitle: 'Diseños de Autor en Limpiapipas',
    badge: '💐 Insignia',
    icon: '💐',
    image: heroBouquetImg,
    gradient: 'from-[#8E24AA]/85 to-[#2B051C]/90',
  },
  {
    id: 'girasoles',
    label: 'Colección Girasoles',
    subtitle: 'Chenille Amarillo & Núcleo Pardo',
    badge: '🌻 Favoritos',
    icon: '🌻',
    image: girasolesImg,
    gradient: 'from-[#E65100]/85 to-[#2B051C]/90',
  },
  {
    id: 'bodas',
    label: 'Bodas & Novias',
    subtitle: 'Bouquets Nupciales & Distintivos',
    badge: '💍 Elegante',
    icon: '💍',
    image: heroArtImg,
    gradient: 'from-[#4A148C]/85 to-[#2B051C]/90',
  },
  {
    id: 'kits',
    label: 'Kits DIY Armar',
    subtitle: '50 Fibras + Guía de Moldeado',
    badge: '🎨 Manualidades',
    icon: '🎨',
    image: kitDiyImg,
    gradient: 'from-[#00695C]/85 to-[#2B051C]/90',
  },
  {
    id: 'regalos',
    label: 'Regalos & Cajas',
    subtitle: 'Arreglos en Cofre + Tarjeta',
    badge: '🎁 Sorpresa',
    icon: '🎁',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    gradient: 'from-[#C2185B]/85 to-[#2B051C]/90',
  },
];

const WINTER_FILTER_CHIPS = [
  { id: 'todos', label: 'Todas las Flores', icon: '❄️' },
  { id: 'flores-temporada', label: 'Flores Temporada', icon: '🌺' },
  { id: 'ramos', label: 'Ramos Eternos', icon: '💐' },
  { id: 'girasoles', label: 'Girasoles', icon: '🌻' },
  { id: 'bodas', label: 'Bodas & Novias', icon: '💍' },
  { id: 'regalos', label: 'Regalos', icon: '🎁' },
  { id: 'kits', label: 'Kits DIY', icon: '🎨' },
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
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const topRatedProducts = products.filter((p) => p.rating >= 4.9).slice(0, 4);

  return (
    <section className="py-8 bg-[#F4F8FA] text-[#1A237E]" id="productos">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-left space-y-10">

        {/* VISUAL CATEGORY IMAGE MENU SECTION (Menú de Imágenes de Categorías) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cyan-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#f70071]/10 text-[#f70071] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Colecciones Florales IsaFlores</span>
              </div>
              <h2 className="font-syne text-2xl sm:text-4xl font-black text-[#1A237E]">
                Menú de Categorías Visuales
              </h2>
            </div>
            <span className="text-xs font-bold text-[#00838F] block">
              Toca una categoría con foto para filtrar la tienda
            </span>
          </div>

          {/* Category Cards Grid & Horizontal Scroll */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {CATEGORY_IMAGE_MENU.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative h-48 sm:h-56 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                    isSelected
                      ? 'border-[#f70071] ring-4 ring-[#f70071]/30 scale-[1.02]'
                      : 'border-white hover:border-cyan-300'
                  }`}
                >
                  {/* Category Image */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} p-3 sm:p-4 flex flex-col justify-between text-white transition-opacity`} />

                  {/* Top Badge & Selected Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border border-white/20">
                      {cat.badge}
                    </span>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg animate-bounce">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Text Content */}
                  <div className="relative z-10 space-y-1 text-left">
                    <div className="text-xl sm:text-2xl drop-shadow-md">{cat.icon}</div>
                    <h3 className="font-syne font-black text-sm sm:text-base text-white leading-tight drop-shadow-sm group-hover:text-[#ffc0dc] transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-[10px] text-white/80 font-medium line-clamp-1">
                      {cat.subtitle}
                    </p>
                    <div className="pt-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#ff96c5] group-hover:translate-x-1 transition-transform">
                      <span>Ver Flores</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sleek Pills Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {WINTER_FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 border ${
                selectedCategory === chip.id
                  ? 'bg-[#1A237E] text-white border-[#1A237E] shadow-md ring-2 ring-[#00838F]'
                  : 'bg-white text-[#1A237E] border-cyan-200 hover:bg-cyan-50'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Uber Eats "Seleccionados para Ti" Featured Row */}
        {selectedCategory === 'todos' && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#C2185B] fill-[#C2185B]" />
                <h3 className="font-extrabold text-xl sm:text-2xl text-[#1A237E]">
                  Seleccionados para Ti
                </h3>
              </div>
              <span className="text-xs font-bold text-[#00838F] uppercase">
                ❄️ Envío Gratis en La Florida
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topRatedProducts.map((p) => {
                const pImage = p.image || (p as any).images?.[0];
                return (
                  <div
                    key={`feat-${p.id}`}
                    onClick={() => onQuickView(p)}
                    className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex justify-between gap-3 relative"
                  >
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <span className="bg-[#00838F] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block">
                          🔥 Popular
                        </span>
                        <h4 className="font-extrabold text-sm text-[#1A237E] group-hover:text-[#00838F] transition-colors leading-tight">
                          {p.name}
                        </h4>
                      </div>

                      <div className="space-y-1">
                        <span className="font-extrabold text-base text-[#C2185B] block">
                          ${p.price.toLocaleString('es-CL')} CLP
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          Envío Gratis
                        </span>
                      </div>
                    </div>

                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-cyan-50 shrink-0 border border-cyan-100">
                      <img
                        src={pImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p);
                        }}
                        className="absolute bottom-1 right-1 bg-[#C2185B] hover:bg-[#8E24AA] text-white p-2 rounded-full shadow-md cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uber Eats Clean Split-Card Product Items List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-200 pb-3">
            <h3 className="font-extrabold text-xl sm:text-2xl text-[#1A237E]">
              {selectedCategory === 'todos' ? 'Menú de Ramos & Flores' : WINTER_FILTER_CHIPS.find(c => c.id === selectedCategory)?.label}
            </h3>
            <span className="text-xs font-bold text-cyan-900/60">
              {filteredProducts.length} opciones disponibles
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-cyan-100 space-y-3">
              <span className="text-4xl block">❄️</span>
              <h4 className="font-bold text-lg text-[#1A237E]">No hay flores en esta sección</h4>
              <p className="text-xs text-cyan-900/60">Prueba seleccionando otra categoría visual o busca con otro término.</p>
              <button
                onClick={() => setSelectedCategory('todos')}
                className="bg-[#00838F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase cursor-pointer hover:bg-[#00695C] transition-all"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const productImage = product.image || (product as any).images?.[0] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';

                return (
                  <div
                    key={product.id}
                    onClick={() => onQuickView(product)}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-cyan-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex justify-between gap-4 text-left relative"
                  >
                    {/* Item Text & Price Details (Left Side Uber Eats Style) */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{product.rating}</span>
                          </span>
                          <span className="bg-cyan-50 text-[#00838F] text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-cyan-200">
                            ❄️ 72h / Express
                          </span>
                        </div>

                        <h4 className="font-extrabold text-base sm:text-lg text-[#1A237E] group-hover:text-[#00838F] transition-colors leading-snug">
                          {product.name}
                        </h4>

                        <p className="text-xs text-cyan-950/70 line-clamp-2 leading-relaxed font-medium">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="font-extrabold text-xl text-[#C2185B] block">
                            ${product.price.toLocaleString('es-CL')} <span className="text-xs text-cyan-900/60 font-normal">CLP</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            🎉 Envío Gratis La Florida
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          className={`p-2 rounded-full border transition-all ${
                            isWishlisted ? 'bg-[#C2185B] text-white border-[#C2185B]' : 'bg-gray-50 text-gray-400 hover:text-[#C2185B] border-gray-200'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Item Thumbnail & Plus Button (Right Side Uber Eats Style) */}
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-cyan-50 shrink-0 border border-cyan-100">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="absolute bottom-2 right-2 bg-[#C2185B] hover:bg-[#8E24AA] text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-all transform hover:scale-110 flex items-center justify-center"
                        title="Agregar al pedido"
                      >
                        <Plus className="w-5 h-5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
