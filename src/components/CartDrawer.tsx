import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 25000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2B051C]/80 backdrop-blur-md animate-fade-in flex justify-end">
      <div className="bg-[#2B051C] text-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl text-left border-l-2 border-[#f70071]/40">
        {/* Header */}
        <div className="bg-[#2B051C] text-white p-6 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ffc0dc]" />
            <h2 className="font-syne text-xl font-black text-white">
              Bolsa de Compra ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#42082B] p-4 border-b border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-white">
              <Truck className="w-4 h-4 text-[#ffc0dc]" />
              <span>
                {remainingForFreeShipping === 0
                  ? '¡Felicidades! Tienes Despacho Gratuito'
                  : `Faltan $${remainingForFreeShipping.toLocaleString('es-CL')} para Envío Gratis`}
              </span>
            </span>
            <span className="text-[#ff96c5] font-black">{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-[#f70071] to-[#ff1b82] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-xs"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center p-2 shrink-0 border border-white/20"
                  style={{ backgroundColor: item.product.bgTint }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-h-12 object-contain"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="font-syne text-sm font-extrabold text-white line-clamp-1">
                    {item.product.name}
                  </h4>
                  <span className="text-xs font-black text-[#ffc0dc] block">
                    ${(item.product.price * item.quantity).toLocaleString('es-CL')} CLP
                  </span>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full border border-white/20">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center hover:bg-[#f70071] transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center hover:bg-[#ff1b82] transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[#ff96c5] hover:text-[#f70071] p-1 transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <span className="text-5xl">💐</span>
              <h3 className="font-syne text-xl font-bold text-white">
                Tu bolsa está vacía
              </h3>
              <p className="text-xs text-white/80 max-w-xs leading-relaxed font-semibold">
                Explora nuestras ramos de flores de autor y añade tus flores favoritas.
              </p>
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#2B051C] border-t border-white/20 space-y-4 shadow-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-white/80 font-bold">
                <span>Subtotal Creaciones</span>
                <span className="font-black text-white">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/80 font-bold">
                <span>Despacho</span>
                <span className="font-black text-[#ffc0dc]">
                  {remainingForFreeShipping === 0 ? '¡Gratis!' : 'Por calcular'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-white/20 pt-2">
                <span className="font-syne text-base font-bold text-white">Total Estimado</span>
                <span className="font-syne text-2xl font-black text-white">
                  ${subtotal.toLocaleString('es-CL')} <span className="text-xs font-sans text-[#ff96c5]">CLP</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-4 bg-gradient-to-r from-[#f70071] to-[#ff1b82] hover:opacity-95 text-white rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer transform hover:scale-[1.02] border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-[#ffc0dc]" />
              <span>Cotizar Pedido Completo</span>
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-center text-xs text-white/70 hover:underline cursor-pointer font-bold"
            >
              Vaciar Bolsa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
