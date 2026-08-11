import React, { useState, useEffect } from 'react';
import { X, Send, ShoppingBag, MapPin, Calendar, User, Phone, FileText, CheckCircle2, ShieldCheck, Sparkles, MessageCircle, Lock, Zap, Clock, Truck, Copy, Camera, Search } from 'lucide-react';
import { CartItem } from '../types';
import { db } from '../services/db';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

const REGIONES_CHILE: Record<string, string[]> = {
  'Región Metropolitana de Santiago': [
    'La Florida', 'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'La Reina',
    'Macul', 'Peñalolén', 'San Miguel', 'Maipú', 'Pudahuel',
    'Quilicura', 'Huechuraba', 'Recoleta', 'Independencia', 'Estación Central',
    'Cerrillos', 'Quinta Normal', 'San Joaquín', 'La Cisterna', 'San Ramón',
    'El Bosque', 'Pedro Aguirre Cerda', 'Lo Espejo', 'Puente Alto', 'San Bernardo',
    'Colina', 'Lampa', 'Talagante', 'Melipilla', 'Buin', 'Paine', 'Otra Comuna RM'
  ],
  'Región de Valparaíso': [
    'Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana',
    'Quillota', 'San Antonio', 'Los Andes', 'San Felipe', 'La Ligua', 'Otra Comuna Valparaíso'
  ],
  'Región del Biobío': [
    'Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante',
    'Coronel', 'Hualpén', 'Los Ángeles', 'Chillán', 'Tomé', 'Otra Comuna Biobío'
  ],
  'Región de La Araucanía': [
    'Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Otra Comuna Araucanía'
  ],
  'Región de Los Lagos': [
    'Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud', 'Otra Comuna Los Lagos'
  ],
  'Región de Coquimbo': [
    'La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Otra Comuna Coquimbo'
  ],
  'Región de Antofagasta': [
    'Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Otra Comuna Antofagasta'
  ],
  'Región del Maule': [
    'Talca', 'Curicó', 'Linares', 'Constitución', 'Otra Comuna Maule'
  ],
  'Región de O\'Higgins': [
    'Rancagua', 'Machalí', 'San Fernando', 'Pichilemu', 'Otra Comuna O\'Higgins'
  ],
  'Región de Tarapacá': [
    'Iquique', 'Alto Hospicio', 'Otra Comuna Tarapacá'
  ],
  'Región de Los Ríos': [
    'Valdivia', 'La Unión', 'Río Bueno', 'Otra Comuna Los Ríos'
  ],
  'Región de Arica y Parinacota': [
    'Arica', 'Putre', 'Otra Comuna Arica'
  ],
  'Región de Atacama': [
    'Copiapó', 'Vallenar', 'Caldera', 'Otra Comuna Atacama'
  ],
  'Región de Ñuble': [
    'Chillán', 'San Carlos', 'Bulnes', 'Otra Comuna Ñuble'
  ],
  'Región de Aysén': [
    'Coyhaique', 'Puerto Aysén', 'Otra Comuna Aysén'
  ],
  'Región de Magallanes': [
    'Punta Arenas', 'Puerto Natales', 'Otra Comuna Magallanes'
  ]
};

function formatDateISO(dateObj: Date): string {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
}) => {
  const today = new Date();
  const date72h = new Date(today);
  date72h.setDate(today.getDate() + 3);

  const todayStr = formatDateISO(today);
  const date72hStr = formatDateISO(date72h);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Región Metropolitana de Santiago');
  const [selectedComuna, setSelectedComuna] = useState('La Florida');
  const [selectedCourier, setSelectedCourier] = useState('Starken');
  
  // Delivery speed state
  const [isExpress, setIsExpress] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(date72hStr);
  const [cardMessage, setCardMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Created Order ID State
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isExpress) {
      setDeliveryDate(todayStr);
    } else {
      setDeliveryDate(date72hStr);
    }
  }, [isExpress]);

  if (!isOpen) return null;

  const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const expressSurcharge = isExpress ? 3500 : 0;

  // Calculate Shipping Cost based on Region & Comuna
  const isRM = selectedRegion === 'Región Metropolitana de Santiago';
  const isLaFlorida = isRM && selectedComuna === 'La Florida';

  let shippingCost = 0;
  let shippingText = '';

  if (isLaFlorida) {
    shippingCost = 0;
    shippingText = '🎉 ¡Despacho GRATIS (La Florida)!';
  } else if (isRM) {
    shippingCost = 3500;
    shippingText = '🚚 Despacho Región Metropolitana ($3.500 CLP)';
  } else {
    shippingCost = 0;
    shippingText = `📦 Por Pagar vía ${selectedCourier} (Regiones)`;
  }

  const totalAmount = itemsSubtotal + expressSurcharge + shippingCost;
  const minSelectableDate = isExpress ? todayStr : date72hStr;

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reg = e.target.value;
    setSelectedRegion(reg);
    const comunas = REGIONES_CHILE[reg] || [];
    if (comunas.length > 0) {
      setSelectedComuna(comunas[0]);
    }
  };

  const handleCopyOrderId = () => {
    if (createdOrderId) {
      navigator.clipboard.writeText(createdOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address || !selectedRegion || !selectedComuna) {
      alert('Por favor completa los campos obligatorios (*).');
      return;
    }

    const itemsSummary = cartItems.map((i) => `${i.product.name} (x${i.quantity})`).join(', ');

    // 1. SAVE TO DATABASE PERSISTENCE LAYER & CAPTURE CREATED ORDER ID
    const updatedOrders = await db.addOrder({
      customerName,
      phone,
      addressComuna: `${address}, ${selectedComuna} (${selectedRegion})`,
      productName: itemsSummary,
      total: totalAmount,
      isExpress,
      deliveryDate,
      status: 'pendiente',
      notes: cardMessage ? `Dedicatoria: "${cardMessage}"` : 'Sin dedicatoria',
    });

    const newCreatedOrder = updatedOrders[0];
    const newOrderId = newCreatedOrder ? newCreatedOrder.id : `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedOrderId(newOrderId);

    // 2. Format WhatsApp Order Quote with Order ID Included
    let message = `🌸 *COTIZACIÓN DE PEDIDO - ISAFLORES* 🌸\n`;
    message += `_Recuerdos que perduran._\n\n`;
    message += `🔑 *NÚMERO DE ORDEN:* *${newOrderId}*\n\n`;
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    message += `• *Nombre:* ${customerName}\n`;
    message += `• *Teléfono:* ${phone}\n`;
    message += `• *Dirección:* ${address}\n`;
    message += `• *Comuna:* ${selectedComuna}\n`;
    message += `• *Región:* ${selectedRegion}\n\n`;

    message += `🚚 *DESPACHO Y LOGÍSTICA:*\n`;
    if (isLaFlorida) {
      message += `🎉 *Despacho GRATUITO en La Florida*\n`;
    } else if (isRM) {
      message += `🚚 *Despacho Región Metropolitana:* $3.500 CLP\n`;
    } else {
      message += `📦 *Envío a Región:* Por Pagar vía ${selectedCourier}\n`;
    }

    if (isExpress) {
      message += `🚀 *SERVICIO EXPRESS MISMO DÍA:* +$3.500 CLP (Entrega Hoy ${deliveryDate})\n\n`;
    } else {
      message += `📦 *DESPACHO ESTÁNDAR (Elaboración 72h):* Entrega el ${deliveryDate}\n\n`;
    }

    message += `💐 *DETALLE DEL PEDIDO (${cartItems.reduce((a, b) => a + b.quantity, 0)} piezas):*\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. *${item.product.name}* (x${item.quantity}) - $${(item.product.price * item.quantity).toLocaleString('es-CL')}\n`;
    });

    if (shippingCost > 0) {
      message += `• *Costo Despacho:* $${shippingCost.toLocaleString('es-CL')} CLP\n`;
    }
    if (isExpress) {
      message += `• *Recargo Servicio Express:* $3.500 CLP\n`;
    }

    if (cardMessage.trim()) {
      message += `\n💌 *DEDICATORIA EN TARJETA DE REGALO:*\n"${cardMessage}"\n`;
    } else {
      message += `\n💌 *DEDICATORIA:* Sin dedicatoria especial\n`;
    }

    message += `\n💰 *TOTAL GENERAL ESTIMADO:* $${totalAmount.toLocaleString('es-CL')} CLP\n\n`;
    message += `📲 *Nota:* Toda transacción y medio de pago se coordina directamente por este chat de WhatsApp.`;

    const whatsappUrl = `https://wa.me/56928704768?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    setIsSubmitted(true);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-dropdown">
      <div className="bg-[#2B051C] border-2 border-[#f70071]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white text-left relative">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#2B051C]/95 backdrop-blur-xl p-6 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f70071] text-white flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne text-2xl font-black text-white">
                Pasarela de Cotización de Pedido
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff96c5] block">
                IsaFlores · Recuerdos que perduran.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Success Screen with Prominent Order ID */}
        {isSubmitted ? (
          <div className="p-8 sm:p-10 text-center space-y-6 animate-dropdown">
            <div className="w-20 h-20 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="font-syne text-3xl font-black text-white">
                ¡Cotización Registrada con Éxito!
              </h4>
              <p className="text-sm text-white/90 font-bold max-w-md mx-auto leading-relaxed">
                Se ha iniciado la conversación en WhatsApp. Tu orden ha sido guardada en nuestro sistema.
              </p>
            </div>

            {/* Prominent Order Number Display Box */}
            <div className="bg-[#42082B] p-6 rounded-3xl border-2 border-[#f70071] space-y-4 max-w-md mx-auto shadow-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff96c5] block">
                🔑 Tu Número de Orden Oficial:
              </span>

              <div className="bg-[#2B051C] py-3.5 px-6 rounded-2xl border border-white/30 flex items-center justify-between gap-3">
                <span className="font-syne text-3xl font-black text-[#ffc0dc] tracking-wider">
                  {createdOrderId}
                </span>

                <button
                  onClick={handleCopyOrderId}
                  className="bg-[#f70071] hover:bg-[#ff1b82] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Instructions Box */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-left space-y-2 text-xs font-bold text-white">
                <div className="flex items-center gap-2 text-[#ff96c5]">
                  <Camera className="w-4 h-4 text-[#ff96c5] shrink-0" />
                  <span className="font-black uppercase">📸 ¡Guarda o saca una foto a tu Número!</span>
                </div>
                <p className="text-[11px] text-white/90 leading-relaxed">
                  Anota o saca una captura de pantalla a este número de orden (<strong>{createdOrderId}</strong>). Podrás ingresar este código en la opción <strong>"🔍 Rastrear Estado de mi Pedido"</strong> del menú superior para consultar en tiempo real cómo avanza tu ramo de flores en el taller.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto bg-white text-[#2B051C] font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-[#ffc0dc] transition-all cursor-pointer shadow-xl"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuote} className="p-6 sm:p-8 space-y-6">
            {/* Order Items Summary */}
            <div className="bg-[#42082B] p-4 sm:p-5 rounded-2xl border border-white/20 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#ffc0dc] block">
                1. Resumen de Flores & Despacho ({cartItems.length} flores)
              </span>

              <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs font-bold text-white border-b border-white/10 pb-2">
                    <span className="truncate pr-2">• {item.product.name} (x{item.quantity})</span>
                    <span className="font-black text-[#ff96c5] shrink-0">${(item.product.price * item.quantity).toLocaleString('es-CL')}</span>
                  </div>
                ))}

                {/* Shipping Fee Line */}
                <div className="flex items-center justify-between text-xs font-bold text-[#ffc0dc] border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Despacho ({selectedComuna}):</span>
                  </span>
                  <span className="font-black">
                    {shippingCost === 0
                      ? isLaFlorida
                        ? 'GRATIS 🎉'
                        : 'Por Pagar (Courier)'
                      : `$${shippingCost.toLocaleString('es-CL')}`}
                  </span>
                </div>

                {/* Express Surcharge Line */}
                {isExpress && (
                  <div className="flex items-center justify-between text-xs font-black text-[#ffc0dc] border-b border-white/10 pb-2">
                    <span>🚀 Servicio Express Mismo Día</span>
                    <span>+$3.500</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-black text-white">
                <span>Total Estimado del Pedido:</span>
                <span className="font-syne text-2xl text-[#ffc0dc]">${totalAmount.toLocaleString('es-CL')} CLP</span>
              </div>
            </div>

            {/* Delivery Speed Selection Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff96c5] block">
                2. Modalidad de Despacho & Tiempo de Elaboración
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpress(false)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    !isExpress
                      ? 'bg-[#f70071] border-white text-white shadow-xl'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Clock className="w-6 h-6 text-[#ffc0dc] shrink-0" />
                  <div>
                    <span className="font-black text-xs block uppercase">Despacho Normal (72 Hrs)</span>
                    <span className="text-[10px] font-bold text-white/90 block">Agenda habilitada desde 3 días</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpress(true)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isExpress
                      ? 'bg-gradient-to-r from-[#f70071] to-[#ff1b82] border-white text-white shadow-xl ring-2 ring-[#ffc0dc]'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Zap className="w-6 h-6 text-[#ffc0dc] fill-current shrink-0 animate-bounce" />
                  <div>
                    <span className="font-black text-xs block uppercase">🚀 Servicio Express (+$3.500)</span>
                    <span className="text-[10px] font-bold text-white/90 block">Habilita entrega HOY mismo</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff96c5] block">
                3. Datos de Despacho y Ubicación
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ff96c5]" />
                    <span>Nombre Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: María José Pérez"
                    className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ff96c5]" />
                    <span>WhatsApp / Celular *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: +56 9 1234 5678"
                    className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff96c5]" />
                    <span>Dirección de Despacho (Calle y Número) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Vicuña Mackenna 7890"
                    className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff96c5]" />
                    <span>Región de Chile *</span>
                  </label>
                  <select
                    required
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="w-full bg-[#42082B] border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none"
                  >
                    {Object.keys(REGIONES_CHILE).map((reg) => (
                      <option key={reg} value={reg} className="bg-[#2B051C] text-white">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff96c5]" />
                    <span>Comuna *</span>
                  </label>
                  <select
                    required
                    value={selectedComuna}
                    onChange={(e) => setSelectedComuna(e.target.value)}
                    className="w-full bg-[#42082B] border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none"
                  >
                    {(REGIONES_CHILE[selectedRegion] || []).map((com) => (
                      <option key={com} value={com} className="bg-[#2B051C] text-white">
                        {com} {com === 'La Florida' ? '🎉 (Despacho GRATIS)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gift Card Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#ff96c5]" />
                  <span>Dedicatoria en Tarjeta de Regalo (Opcional)</span>
                </label>
                <textarea
                  rows={2}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="Escribe el mensaje especial para incluir en la tarjeta hecha a mano..."
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white placeholder-white/50 outline-none"
                />
              </div>

              <div className="bg-[#42082B] p-4 rounded-2xl border-2 border-[#25D366]/60 space-y-2">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <MessageCircle className="w-5 h-5 fill-[#25D366]" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Generación de Orden & Envío a WhatsApp
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-bold">
                  🔒 Al hacer clic abajo, se generará tu Número de Orden de seguimiento y se abrirá el chat oficial de WhatsApp.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-widest py-4 rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-white" />
                <span>Generar Orden & Enviar a WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
