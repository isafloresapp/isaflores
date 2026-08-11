import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Users, ShoppingBag, Truck, Calendar, Phone, CheckCircle2, Search, ArrowRight, ShieldCheck, Sparkles, Plus, Edit3, Trash2, Image, Tag, Code, Layers, Check, Camera, Mic, Upload, Settings, Sliders, RefreshCw, Palette } from 'lucide-react';
import { Product } from '../types';
import { db, DbOrder, CustomFlowerOption } from '../services/db';

interface CrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProductCatalog?: (updatedProducts: Product[]) => void;
}

const INITIAL_CATEGORIES = [
  { id: 'ramos', label: 'Ramos Eternos', icon: '💐' },
  { id: 'girasoles', label: 'Girasoles', icon: '🌻' },
  { id: 'bodas', label: 'Bodas & Novias', icon: '💍' },
  { id: 'eventos', label: 'Eventos', icon: '✨' },
  { id: 'regalos', label: 'Regalos', icon: '🎁' },
  { id: 'kits', label: 'Kits DIY', icon: '🎨' },
];

export const CrmModal: React.FC<CrmModalProps> = ({ isOpen, onClose, onUpdateProductCatalog }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom_bouquet' | 'taxonomy' | 'permissions'>('orders');

  // Database Connected Orders & Products State
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<DbOrder | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // Custom Bouquet Editor State (Flower Types, Colors, Quantities & Prices)
  const [customFlowers, setCustomFlowers] = useState<CustomFlowerOption[]>([]);
  const [editingFlowerId, setEditingFlowerId] = useState<string | null>(null);
  const [flName, setFlName] = useState('');
  const [flColorName, setFlColorName] = useState('');
  const [flColorHex, setFlColorHex] = useState('#ff96c5');
  const [flPrice, setFlPrice] = useState<number>(1500);
  const [flIcon, setFlIcon] = useState('🌸');

  // Edit Order Form Fields
  const [ordName, setOrdName] = useState('');
  const [ordPhone, setOrdPhone] = useState('');
  const [ordAddress, setOrdAddress] = useState('');
  const [ordTotal, setOrdTotal] = useState<number>(0);
  const [ordStatus, setOrdStatus] = useState<DbOrder['status']>('pendiente');
  const [ordNotes, setOrdNotes] = useState('');

  // Taxonomies & Device Permissions State
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Product Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(14990);
  const [category, setCategory] = useState('ramos');
  const [subcategory, setSubcategory] = useState('Ramos de Autor');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Nuevo');
  const [img1, setImg1] = useState('https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>(['Rosa Pastel', 'Fucsia Magenta']);
  const [sku, setSku] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadDatabaseData();
    }
  }, [isOpen]);

  const loadDatabaseData = async () => {
    const loadedOrders = await db.getOrders();
    const loadedProducts = await db.getProducts();
    const loadedCustomFlowers = await db.getCustomFlowers();
    setOrders(loadedOrders);
    setProductsList(loadedProducts);
    setCustomFlowers(loadedCustomFlowers);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'isaflores2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta. (Prueba: admin o isaflores2026)');
    }
  };

  // Custom Bouquet Editor Handlers
  const handleOpenAddFlowerOption = () => {
    setEditingFlowerId(null);
    setFlName('');
    setFlColorName('Rosa Pastel');
    setFlColorHex('#ff96c5');
    setFlPrice(1500);
    setFlIcon('🌸');
  };

  const handleEditFlowerOption = (fl: CustomFlowerOption) => {
    setEditingFlowerId(fl.id);
    setFlName(fl.name);
    setFlColorName(fl.colorName);
    setFlColorHex(fl.colorHex);
    setFlPrice(fl.pricePerStem);
    setFlIcon(fl.iconSvg);
  };

  const handleSaveFlowerOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flName.trim()) return;

    const newFlower: CustomFlowerOption = {
      id: editingFlowerId || `fl-${Date.now()}`,
      name: flName,
      colorName: flColorName,
      colorHex: flColorHex,
      pricePerStem: flPrice,
      iconSvg: flIcon || '🌸',
    };

    let updatedList: CustomFlowerOption[];
    if (editingFlowerId) {
      updatedList = customFlowers.map((f) => (f.id === editingFlowerId ? newFlower : f));
    } else {
      updatedList = [...customFlowers, newFlower];
    }

    await db.saveCustomFlowers(updatedList);
    setCustomFlowers(updatedList);
    setEditingFlowerId(null);
    setFlName('');
    alert(`¡Opción de flor "${flName}" guardada en la Base de Datos!`);
  };

  const handleDeleteFlowerOption = async (flowerId: string) => {
    if (confirm('¿Eliminar esta variedad de flor del diseñador?')) {
      const updatedList = customFlowers.filter((f) => f.id !== flowerId);
      await db.saveCustomFlowers(updatedList);
      setCustomFlowers(updatedList);
    }
  };

  // Database Order Status Update
  const handleStatusChange = async (orderId: string, newStatus: DbOrder['status']) => {
    const updated = await db.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const handleSaveEditedOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const updatedOrder: DbOrder = {
      ...editingOrder,
      customerName: ordName,
      phone: ordPhone,
      addressComuna: ordAddress,
      total: ordTotal,
      status: ordStatus,
      notes: ordNotes,
    };

    const updatedOrders = await db.updateOrder(updatedOrder);
    setOrders(updatedOrders);
    setEditingOrder(null);
    alert(`¡Pedido ${editingOrder.id} guardado en la Base de Datos!`);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageArray = [img1, img2, img3].filter(Boolean);

    const updatedProduct: any = {
      id: editingId || `prod-${Date.now()}`,
      name,
      price,
      category,
      categoryLabel: categories.find((c) => c.id === category)?.label || 'Flores',
      subcategory,
      description,
      badge,
      image: img1 || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
      images: imageArray,
      bgTint: '#FDF0F5',
      rating: 5.0,
      reviewsCount: 1,
      sku,
      metaTitle,
      metaDescription,
      colors: selectedColors
    };

    let newProducts: Product[];
    if (editingId) {
      newProducts = await db.updateProduct(updatedProduct);
    } else {
      newProducts = await db.addProduct(updatedProduct);
    }

    setProductsList(newProducts);
    if (onUpdateProductCatalog) {
      onUpdateProductCatalog(newProducts);
    }

    setIsEditingProduct(false);
    alert(`¡Producto "${name}" guardado!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-dropdown">
      <div className="bg-[#2B051C] border-2 border-[#f70071]/40 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white text-left relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#2B051C]/95 backdrop-blur-xl p-6 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f70071] text-white flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-syne text-2xl font-black text-white">
                Base de Datos & Editor CRM IsaFlores
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366] block">
                Editor de Productos, Cotizaciones & Creador "Diseña tu Ramo"
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={loadDatabaseData} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <RefreshCw className="w-4 h-4 text-[#ff96c5]" />
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-10 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto border border-white/20">
              <Lock className="w-8 h-8 text-[#ff96c5]" />
            </div>
            <h4 className="font-syne text-2xl font-black text-white">Acceso Privado CRM</h4>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña..."
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-xs font-bold text-white text-center"
            />
            <button type="submit" className="w-full bg-[#f70071] text-white font-black text-xs uppercase py-3.5 rounded-full shadow-lg">
              Ingresar al CRM
            </button>
          </form>
        ) : (
          /* Authenticated Panel */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/20 pb-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-[#f70071] text-white shadow-lg' : 'bg-white/10 text-white/70'
                }`}
              >
                Cotizaciones ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'products' ? 'bg-[#f70071] text-white shadow-lg' : 'bg-white/10 text-white/70'
                }`}
              >
                Catálogo Productos ({productsList.length})
              </button>

              <button
                onClick={() => setActiveTab('custom_bouquet')}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'custom_bouquet' ? 'bg-[#25D366] text-white shadow-lg' : 'bg-white/10 text-white/70'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Editor "Diseña tu Ramo" ({customFlowers.length})</span>
              </button>
            </div>

            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h4 className="font-syne text-xl font-black text-white">Cotizaciones Registradas</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="border-b border-white/20 text-[10px] font-black uppercase text-[#ff96c5]">
                        <th className="pb-3">ID / Cliente</th>
                        <th className="pb-3">Teléfono</th>
                        <th className="pb-3">Monto</th>
                        <th className="pb-3">Estado BD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs font-bold">
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="py-3"><span className="text-[#ff96c5] block">{o.id}</span>{o.customerName}</td>
                          <td className="py-3">{o.phone}</td>
                          <td className="py-3 text-[#ffc0dc]">${o.total.toLocaleString('es-CL')}</td>
                          <td className="py-3">
                            <select
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                              className="bg-[#2B051C] text-xs border border-white/30 rounded-xl px-2 py-1"
                            >
                              <option value="pendiente">⏳ Pendiente</option>
                              <option value="en_preparacion">⚙️ En Taller</option>
                              <option value="despachado">✓ Despachado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <h4 className="font-syne text-xl font-black text-white">Catálogo General</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productsList.map((prod) => (
                    <div key={prod.id} className="bg-[#42082B] p-4 rounded-2xl border border-white/20">
                      <h5 className="font-syne text-sm font-bold text-white truncate">{prod.name}</h5>
                      <span className="text-xs font-black text-[#ffc0dc]">${prod.price.toLocaleString('es-CL')} CLP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM BOUQUET STUDIO EDITOR (Types, Colors, Quantities & Prices) */}
            {activeTab === 'custom_bouquet' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <div>
                    <h4 className="font-syne text-xl font-black text-white">
                      Editor de Variedades, Colores & Precios por Tallo
                    </h4>
                    <p className="text-xs text-white/80 font-medium">
                      Configura las flores que los clientes pueden elegir en la sección "Diseña tu Ramo".
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddFlowerOption}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Nueva Flor</span>
                  </button>
                </div>

                {/* Form to Add / Edit Flower Option */}
                <form onSubmit={handleSaveFlowerOption} className="bg-[#42082B] p-5 rounded-3xl border border-white/20 space-y-4">
                  <span className="text-xs font-black uppercase text-[#ff96c5] block">
                    {editingFlowerId ? 'Editar Flor / Tallo' : '✨ Agregar Variedad de Flor'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-white block">Nombre de la Flor *</label>
                      <input
                        type="text"
                        required
                        value={flName}
                        onChange={(e) => setFlName(e.target.value)}
                        placeholder="Ej: Tulipán Holandés"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white block">Nombre del Color *</label>
                      <input
                        type="text"
                        required
                        value={flColorName}
                        onChange={(e) => setFlColorName(e.target.value)}
                        placeholder="Ej: Rosa Pastel"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white block">Color Hex (Tono) *</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={flColorHex}
                          onChange={(e) => setFlColorHex(e.target.value)}
                          className="w-10 h-9 rounded-xl border border-white/30 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={flColorHex}
                          onChange={(e) => setFlColorHex(e.target.value)}
                          className="flex-1 bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white block">Precio por Tallo ($ CLP) *</label>
                      <input
                        type="number"
                        required
                        value={flPrice}
                        onChange={(e) => setFlPrice(Number(e.target.value))}
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-white block">Icono / Emoji *</label>
                      <input
                        type="text"
                        value={flIcon}
                        onChange={(e) => setFlIcon(e.target.value)}
                        placeholder="Ej: 🌸 o 🌻"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none text-center"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase py-2.5 rounded-xl shadow-lg cursor-pointer"
                      >
                        {editingFlowerId ? 'Actualizar Flor' : 'Guardar Flor en BD'}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Table of Custom Flowers */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/20 text-[10px] font-black uppercase text-[#ff96c5]">
                        <th className="pb-3">Flor & Icono</th>
                        <th className="pb-3">Color</th>
                        <th className="pb-3">Precio por Tallo</th>
                        <th className="pb-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs font-bold">
                      {customFlowers.map((fl) => (
                        <tr key={fl.id}>
                          <td className="py-3 flex items-center gap-2">
                            <span className="text-xl">{fl.iconSvg}</span>
                            <span className="text-white font-extrabold">{fl.name}</span>
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs">
                              <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: fl.colorHex }} />
                              <span>{fl.colorName}</span>
                            </span>
                          </td>
                          <td className="py-3 text-[#ffc0dc] font-syne">${fl.pricePerStem.toLocaleString('es-CL')} CLP</td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => handleEditFlowerOption(fl)}
                              className="bg-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-full"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteFlowerOption(fl.id)}
                              className="bg-red-500/20 text-white text-[10px] font-black p-1.5 rounded-full"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
