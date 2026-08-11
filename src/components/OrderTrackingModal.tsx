import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, Sparkles, MapPin, Calendar, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { db, DbOrder } from '../services/db';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [orderInput, setOrderInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<DbOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    const cleanInput = orderInput.trim().toUpperCase();
    const orders = await db.getOrders();
    const match = orders.find(
      (o) => o.id.toUpperCase() === cleanInput || o.phone.includes(cleanInput)
    );

    setIsSearching(false);
    if (match) {
      setSearchedOrder(match);
      setNotFound(false);
    } else {
      setSearchedOrder(null);
      setNotFound(true);
    }
  };

  const getStepProgress = (status: DbOrder['status']) => {
    if (status === 'despachado') return 3;
    if (status === 'en_preparacion') return 2;
    return 1; // pendiente
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-dropdown">
      <div className="bg-white border-2 border-[#F9E2EC] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#1A0D18] text-left relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl p-6 border-b border-[#F9E2EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E91E63] text-white flex items-center justify-center shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-flora text-2xl font-extrabold text-[#1A0D18]">
                Consulta el Estado de tu Pedido
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E91E63] block">
                IsaFlores · Seguimiento en Tiempo Real desde la Base de Datos
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FDF0F5] hover:bg-[#E91E63] text-[#1A0D18] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#F9E2EC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracking Search Form */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleTrackOrder} className="bg-[#FDF0F5] p-5 rounded-2xl border border-[#F9E2EC] space-y-3">
            <label className="text-xs font-extrabold text-[#1A0D18] flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#E91E63]" />
              <span>Ingresa tu Número de Orden (Ej: ORD-1001) o Teléfono *</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="Ej: ORD-1001 o +56 9 1234 5678"
                className="flex-1 bg-white border border-[#F9E2EC] rounded-xl px-4 py-3 text-xs font-bold text-[#1A0D18] placeholder-[#1A0D18]/40 outline-none focus:border-[#E91E63]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#E91E63] hover:bg-[#C2185B] text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow-md cursor-pointer transition-all shrink-0"
              >
                {isSearching ? 'Buscando...' : 'Consultar'}
              </button>
            </div>
            <span className="text-[10px] font-semibold text-[#1A0D18]/60 block">
              💡 Puedes consultar tu estado en cualquier momento. Los datos se actualizan automáticamente cuando el taller modifica tu pedido.
            </span>
          </form>

          {/* Not Found Message */}
          {notFound && (
            <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-200 text-center space-y-2">
              <span className="text-2xl block">⚠️</span>
              <h4 className="font-bold text-sm">No encontramos la orden "{orderInput}"</h4>
              <p className="text-xs">
                Verifica que el número de orden sea correcto o contáctanos por WhatsApp para asistirte de inmediato.
              </p>
            </div>
          )}

          {/* Searched Order Details & Live Progress Bar */}
          {searchedOrder && (
            <div className="bg-white p-6 rounded-3xl border-2 border-[#F9E2EC] shadow-md space-y-6 animate-dropdown">
              {/* Order Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F9E2EC] pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#E91E63] tracking-widest block">
                    Orden Registrada
                  </span>
                  <h4 className="font-serif-flora text-2xl font-extrabold text-[#1A0D18]">
                    {searchedOrder.id}
                  </h4>
                  <span className="text-xs font-bold text-[#1A0D18]/70 block">
                    Cliente: {searchedOrder.customerName}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-[#1A0D18]/60 block">Fecha Programada de Entrega:</span>
                  <span className="font-bold text-sm text-[#E91E63]">{searchedOrder.deliveryDate}</span>
                </div>
              </div>

              {/* Live Timeline Step Tracker */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#1A0D18] block">
                  Estado Actual de Elaboración & Despacho:
                </span>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  {/* Step 1: Registered */}
                  <div className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    getStepProgress(searchedOrder.status) >= 1
                      ? 'bg-[#FDF0F5] border-[#E91E63] text-[#E91E63]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    <Clock className="w-5 h-5 mx-auto mb-1 text-[#E91E63]" />
                    <span className="block text-[10px] uppercase font-black">1. Cotización</span>
                    <span className="text-[9px] font-semibold block">Registrada</span>
                  </div>

                  {/* Step 2: In Workshop */}
                  <div className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    getStepProgress(searchedOrder.status) >= 2
                      ? 'bg-[#FDF0F5] border-[#E91E63] text-[#E91E63]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    <Sparkles className="w-5 h-5 mx-auto mb-1 text-[#E91E63]" />
                    <span className="block text-[10px] uppercase font-black">2. En Taller</span>
                    <span className="text-[9px] font-semibold block">Elaboración a mano</span>
                  </div>

                  {/* Step 3: Dispatched */}
                  <div className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    getStepProgress(searchedOrder.status) >= 3
                      ? 'bg-[#25D366]/10 border-[#25D366] text-[#25D366]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    <Truck className="w-5 h-5 mx-auto mb-1 text-[#25D366]" />
                    <span className="block text-[10px] uppercase font-black">3. Despachado</span>
                    <span className="text-[9px] font-semibold block">En camino / Entregado</span>
                  </div>
                </div>

                {/* Status Message Box */}
                <div className="bg-[#FDF0F5] p-4 rounded-2xl border border-[#F9E2EC] text-xs font-bold text-[#1A0D18]">
                  {searchedOrder.status === 'pendiente' && (
                    <p>⏳ Tu cotización fue recibida con éxito. Nuestro taller está confirmando tu pedido.</p>
                  )}
                  {searchedOrder.status === 'en_preparacion' && (
                    <p>⚙️ ¡Tu ramo de flores está siendo moldeado a mano con cariño en nuestro taller en este momento!</p>
                  )}
                  {searchedOrder.status === 'despachado' && (
                    <p>🎉 ¡Excelente noticia! Tu pedido fue finalizado y se encuentra despachado en camino a tu dirección.</p>
                  )}
                  {searchedOrder.status === 'cancelado' && (
                    <p className="text-red-600">❌ La orden fue cancelada. Contáctanos por WhatsApp si tienes alguna consulta.</p>
                  )}
                </div>
              </div>

              {/* Details List */}
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-xs font-semibold text-[#1A0D18]">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-[#1A0D18]/60">Flores Solicitadas:</span>
                  <span className="font-bold">{searchedOrder.productName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-[#1A0D18]/60">Dirección de Despacho:</span>
                  <span className="font-bold">{searchedOrder.addressComuna}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-[#1A0D18]/60">Modalidad:</span>
                  <span className="font-bold text-[#E91E63]">
                    {searchedOrder.isExpress ? '🚀 Servicio Express (Entrega Mismo Día)' : '📦 Despacho Normal 72h'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A0D18]/60">Total Estimado:</span>
                  <span className="font-serif-flora text-base font-extrabold text-[#E91E63]">${searchedOrder.total.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>

              {/* WhatsApp Contact Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/56928704768?text=Hola%20IsaFlores%2C%20quisiera%20consultar%20sobre%20mi%20orden%20${searchedOrder.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
