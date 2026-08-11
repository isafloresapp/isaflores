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

const INITIAL_SUBCATEGORIES: Record<string, string[]> = {
  ramos: ['Ramos de Autor', 'Ramos de Rosas', 'Ramos Mixtos'],
  girasoles: ['Girasoles Individuales', 'Ramos de Girasol', 'Cajas de Girasoles'],
  bodas: ['Ramos de Novia', 'Boutonnieres', 'Centros de Mesa'],
  eventos: ['Decoración de Mesas', 'Recuerdos Corporativos', 'Arreglos de Escenario'],
  regalos: ['Cajas de Regalo', 'Flores con Tarjeta', 'Ediciones Especiales'],
  kits: ['Kits Principiantes', 'Kits Avanzados', 'Insumos de Limpiapipas'],
};

const AVAILABLE_COLORS = [
  { name: 'Rosa Pastel', hex: '#ff96c5' },
  { name: 'Fucsia Magenta', hex: '#f70071' },
  { name: 'Coral Cálido', hex: '#ff5aa4' },
  { name: 'Amarillo Girasol', hex: '#EAB308' },
  { name: 'Blanco Puro', hex: '#FFFFFF' },
  { name: 'Rojo Pasión', hex: '#EF4444' },
  { name: 'Púrpura Elegante', hex: '#A855F7' },
  { name: 'Verde Botánico', hex: '#22C55E' },
];

export const CrmModal: React.FC<CrmModalProps> = ({ isOpen, onClose, onUpdateProductCatalog }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom_bouquet' | 'taxonomy' | 'permissions'>('orders');

  // Database State
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<DbOrder | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // Custom Bouquet Editor State
  const [customFlowers, setCustomFlowers] = useState<CustomFlowerOption[]>([]);
  const [editingFlowerId, setEditingFlowerId] = useState<string | null>(null);
  const [flName, setFlName] = useState('');
  const [flColorName, setFlColorName] = useState('');
  const [flColorHex, setFlColorHex] = useState('#ff96c5');
  const [flPrice, setFlPrice] = useState<number>(1500);
  const [flIcon, setFlIcon] = useState('🌸');

  // Taxonomies State
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [subcategoriesMap, setSubcategoriesMap] = useState(INITIAL_SUBCATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newSubcatName, setNewSubcatName] = useState('');
  const [selectedTaxCategory, setSelectedTaxCategory] = useState('ramos');

  // Product Add / Edit Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(14990);
  const [category, setCategory] = useState('ramos');
  const [subcategory, setSubcategory] = useState('Ramos de Autor');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Nuevo');
  
  // Image Slots (Up to 3) with Phone Gallery / Camera Upload
  const [img1, setImg1] = useState('https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>(['Rosa Pastel', 'Fucsia Magenta']);
  const [sku, setSku] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Hidden File Inputs for Phone Gallery and Camera
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const [targetImgSlot, setTargetImgSlot] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (isOpen) {
      loadDatabaseData();
    }
  }, [isOpen]);

  const loadDatabaseData = async () => {
    const loadedOrders = await db.getOrders();
    const loadedProducts = await db.getProducts();
    const loadedCustomFlowers = await db.getCustomFlowers();
    setOrders(loadedOrders || []);
    setProductsList(loadedProducts || []);
    setCustomFlowers(loadedCustomFlowers || []);
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

  // Image File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        if (targetImgSlot === 1) setImg1(base64Url);
        else if (targetImgSlot === 2) setImg2(base64Url);
        else if (targetImgSlot === 3) setImg3(base64Url);
        alert(`¡Foto cargada desde la Galería/Cámara en el espacio ${targetImgSlot}!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAutoFields = (productName: string, desc: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const safeName = (productName || 'RAM').slice(0, 3).toUpperCase();
    const newSku = `ISA-${safeName}-${randomNum}`;
    const title = `${productName || 'Producto'} | Flores Eternas IsaFlores Chile`;
    const metaDesc = `${desc || productName || 'Producto IsaFlores'} - Hecho a mano en Chile con limpiapipas y goma EVA. Despacho gratis en La Florida.`;

    setSku(newSku);
    setMetaTitle(title);
    setMetaDescription(metaDesc);
  };

  const handleOpenAddProduct = () => {
    setEditingId(null);
    setName('');
    setPrice(14990);
    setCategory(categories[0]?.id || 'ramos');
    setSubcategory(subcategoriesMap[categories[0]?.id || 'ramos']?.[0] || 'Ramos de Autor');
    setDescription('');
    setBadge('Nuevo');
    setImg1('https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800');
    setImg2('');
    setImg3('');
    setSelectedColors(['Rosa Pastel']);
    generateAutoFields('Ramo Nuevo', 'Hermoso ramo hecho a mano.');
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name || '');
    setPrice(prod.price || 0);
    setCategory(prod.category || 'ramos');
    setSubcategory((prod as any).subcategory || 'Ramos de Autor');
    setDescription(prod.description || '');
    setBadge(prod.badge || 'Destacado');
    setImg1(prod.image || '');
    setImg2((prod as any).images?.[1] || '');
    setImg3((prod as any).images?.[2] || '');
    setSelectedColors((prod as any).colors || ['Fucsia Magenta']);
    
    setSku((prod as any).sku || `ISA-${(prod.id || 'PROD').slice(0, 4).toUpperCase()}-2026`);
    setMetaTitle((prod as any).metaTitle || `${prod.name || 'Producto'} | IsaFlores Chile`);
    setMetaDescription((prod as any).metaDescription || prod.description || '');

    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageArray = [img1, img2, img3].filter(Boolean);

    const updatedProduct: any = {
      id: editingId || `prod-${Date.now()}`,
      name: name || 'Ramo Sin Nombre',
      price: price || 0,
      category: category || 'ramos',
      categoryLabel: categories.find((c) => c.id === category)?.label || 'Flores',
      subcategory: subcategory || 'General',
      description: description || '',
      fullDetails: `${description || ''}\n\n• SKU: ${sku}\n• Categoría: ${category} / ${subcategory}\n• Colores disponibles: ${selectedColors.join(', ')}`,
      badge: badge || 'Nuevo',
      image: img1 || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
      images: imageArray,
      bgTint: '#FDF0F5',
      rating: 5.0,
      reviewsCount: 1,
      tags: [category, subcategory, ...selectedColors, 'flores eternas'],
      sku: sku || 'ISA-AUTO-2026',
      metaTitle: metaTitle || 'IsaFlores Chile',
      metaDescription: metaDescription || 'Flores eternas',
      colors: selectedColors
    };

    let newProducts: Product[];
    if (editingId) {
      newProducts = await db.updateProduct(updatedProduct);
    } else {
      newProducts = await db.addProduct(updatedProduct);
    }

    setProductsList(newProducts || []);
    if (onUpdateProductCatalog) {
      onUpdateProductCatalog(newProducts || []);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isaflores_catalog_changed', { detail: newProducts }));
    }

    setIsEditingProduct(false);
    alert(`¡Producto "${name}" guardado e insertado en la Base de Datos con éxito!`);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (confirm('¿Eliminar este producto de la Base de Datos?')) {
      const newProducts = await db.deleteProduct(prodId);
      setProductsList(newProducts || []);
      if (onUpdateProductCatalog) {
        onUpdateProductCatalog(newProducts || []);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('isaflores_catalog_changed', { detail: newProducts }));
      }
    }
  };

  const toggleColorSelect = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  // Custom Bouquet Handlers
  const handleOpenAddFlowerOption = () => {
    setEditingFlowerId(null);
    setFlName('');
    setFlColorName('Rosa Pastel');
    setFlColorHex('#ff96c5');
    setFlPrice(1500);
    setFlIcon('🌸');
  };

  const handleSaveFlowerOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flName.trim()) return;

    const newFlower: CustomFlowerOption = {
      id: editingFlowerId || `fl-${Date.now()}`,
      name: flName,
      colorName: flColorName,
      colorHex: flColorHex,
      pricePerStem: flPrice || 0,
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

  // Order Status Handler
  const handleStatusChange = async (orderId: string, newStatus: DbOrder['status']) => {
    const updated = await db.updateOrderStatus(orderId, newStatus);
    setOrders(updated || []);
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const catId = (newCatName || '').toLowerCase().replace(/\s+/g, '-');
    setCategories((prev) => [...prev, { id: catId, label: newCatName, icon: '🌸' }]);
    setSubcategoriesMap((prev) => ({ ...prev, [catId]: ['General'] }));
    setNewCatName('');
    alert(`¡Categoría "${newCatName}" creada con éxito!`);
  };

  const handleAddSubcategory = () => {
    if (!newSubcatName.trim()) return;
    setSubcategoriesMap((prev) => ({
      ...prev,
      [selectedTaxCategory]: [...(prev[selectedTaxCategory] || []), newSubcatName]
    }));
    setNewSubcatName('');
    alert(`¡Subcategoría agregada a "${selectedTaxCategory}"!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-dropdown">
      {/* Hidden File Inputs for Phone Gallery and Camera */}
      <input type="file" ref={fileInputGalleryRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
      <input type="file" ref={fileInputCameraRef} accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />

      <div className="bg-[#2B051C] border-2 border-[#f70071]/40 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl text-white text-left relative">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#2B051C]/95 backdrop-blur-xl p-4 sm:p-6 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f70071] text-white flex items-center justify-center shadow-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-syne text-xl sm:text-2xl font-black text-white">
                Base de Datos & Editor CRM IsaFlores
              </h3>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#25D366] block">
                Optimizado para Celulares & Computadores
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
          <form onSubmit={handleLogin} className="p-8 sm:p-10 text-center max-w-md mx-auto space-y-6">
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
          <div className="p-4 sm:p-8 space-y-6">
            {/* Navigation Tabs (Scrollable on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/20 pb-3">
              <button
                onClick={() => { setActiveTab('orders'); setIsEditingProduct(false); }}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-[#f70071] text-white shadow-lg' : 'bg-white/10 text-white/70'
                }`}
              >
                Cotizaciones ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'products' ? 'bg-[#25D366] text-white shadow-lg ring-2 ring-white' : 'bg-white/10 text-white/70'
                }`}
              >
                Gestor Productos ({productsList.length})
              </button>

              <button
                onClick={() => { setActiveTab('custom_bouquet'); setIsEditingProduct(false); }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'custom_bouquet' ? 'bg-[#25D366] text-white shadow-lg' : 'bg-white/10 text-white/70'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Diseña tu Ramo ({customFlowers.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('taxonomy'); setIsEditingProduct(false); }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'taxonomy' ? 'bg-[#f70071] text-white shadow-lg' : 'bg-white/10 text-white/70'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Categorías</span>
              </button>
            </div>

            {/* TAB 1: ORDERS WITH FAILSAFE PROTECTION AGAINST UNDEFINED PROPS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h4 className="font-syne text-xl font-black text-white">Cotizaciones Registradas</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="border-b border-white/20 text-[10px] font-black uppercase text-[#ff96c5]">
                        <th className="pb-3">ID / Cliente</th>
                        <th className="pb-3">Teléfono</th>
                        <th className="pb-3">Monto Total</th>
                        <th className="pb-3">Estado BD Desplegable</th>
                        <th className="pb-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs font-bold">
                      {orders.map((o) => {
                        const safePhone = (o.phone || '').replace(/[^0-9]/g, '');
                        const safeTotal = (o.total || 0).toLocaleString('es-CL');
                        return (
                          <tr key={o.id || Math.random().toString()}>
                            <td className="py-3"><span className="text-[#ff96c5] block">{o.id || 'ORD-00'}</span>{o.customerName || 'Cliente'}</td>
                            <td className="py-3">{o.phone || 'Sin teléfono'}</td>
                            <td className="py-3 text-[#ffc0dc]">${safeTotal}</td>
                            <td className="py-3">
                              <select
                                value={o.status || 'pendiente'}
                                onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                                className="bg-[#2B051C] text-xs font-bold border border-white/30 rounded-xl px-2 py-1"
                              >
                                <option value="pendiente">⏳ Pendiente</option>
                                <option value="en_preparacion">⚙️ En Taller</option>
                                <option value="despachado">✓ Despachado</option>
                                <option value="cancelado">❌ Cancelado</option>
                              </select>
                            </td>
                            <td className="py-3 text-right">
                              <a href={`https://wa.me/${safePhone}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                                WhatsApp
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS MANAGER */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {!isEditingProduct ? (
                  /* Products List & Prominent Mobile Action Button */
                  <div className="space-y-4">
                    <div className="bg-[#42082B] p-4 rounded-2xl border-2 border-[#25D366] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                      <div>
                        <h4 className="font-syne text-lg sm:text-xl font-black text-white">
                          Catálogo de Productos ({productsList.length})
                        </h4>
                        <span className="text-[10px] text-[#ff96c5] font-bold block">
                          Agrega o edita flores con foto de tu celular y categorías desplegables
                        </span>
                      </div>

                      <button
                        onClick={handleOpenAddProduct}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-2xl cursor-pointer transform active:scale-95 transition-all"
                      >
                        <Plus className="w-5 h-5 text-white" />
                        <span>+ Agregar Nuevo Producto</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {productsList.map((prod) => (
                        <div key={prod.id} className="bg-[#42082B] p-4 rounded-2xl border border-white/20 flex flex-col justify-between space-y-3">
                          <div className="flex gap-3">
                            <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-xl border border-white/20 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="text-[9px] font-black text-[#ff96c5] block uppercase">{prod.categoryLabel || prod.category}</span>
                              <h5 className="font-syne text-sm font-bold text-white truncate">{prod.name}</h5>
                              <span className="text-xs font-black text-[#ffc0dc]">${(prod.price || 0).toLocaleString('es-CL')} CLP</span>
                              <span className="text-[9px] text-white/50 block">SKU: {(prod as any).sku || `ISA-${(prod.id || 'PROD').slice(0, 4).toUpperCase()}-2026`}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="flex-1 bg-white/10 hover:bg-[#f70071] text-white text-[10px] font-black py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="bg-red-500/20 hover:bg-red-600 text-white text-[10px] font-black p-2 rounded-xl cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Add / Edit Product Form */
                  <form onSubmit={handleSaveProduct} className="bg-[#42082B] p-4 sm:p-6 rounded-3xl border border-white/20 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                      <h4 className="font-syne text-lg sm:text-xl font-black text-white">
                        {editingId ? `Editar: ${name}` : '✨ Crear Nuevo Producto'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        className="text-xs font-black text-white/70 hover:text-white"
                      >
                        ✕ Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Product Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white">Nombre del Producto *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (!editingId) generateAutoFields(e.target.value, description);
                          }}
                          placeholder="Ej: Ramo de Rosas Rojas y Girasol"
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white">Precio ($ CLP) *</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                        />
                      </div>

                      {/* Category Selection Dropdown <select> */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ff96c5] flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Categoría Principal (Menú Desplegable) *</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setCategory(newCat);
                            setSubcategory(subcategoriesMap[newCat]?.[0] || 'General');
                          }}
                          className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id} className="bg-[#2B051C] text-white">
                              {c.icon} {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory Selection Dropdown <select> */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ff96c5] flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Subcategoría (Menú Desplegable) *</span>
                        </label>
                        <select
                          value={subcategory}
                          onChange={(e) => setSubcategory(e.target.value)}
                          className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                        >
                          {(subcategoriesMap[category] || ['General']).map((sub) => (
                            <option key={sub} value={sub} className="bg-[#2B051C] text-white">
                              • {sub}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Image Upload Box with Phone Gallery & Camera Upload Buttons */}
                      <div className="sm:col-span-2 space-y-3 bg-[#2B051C] p-4 rounded-2xl border border-white/20">
                        <span className="text-xs font-black text-[#ff96c5] flex items-center gap-1.5">
                          <Image className="w-4 h-4" />
                          <span>Subir Fotos desde la Galería del Celular o Cámara (Hasta 3 Fotos)</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[1, 2, 3].map((slotNum) => {
                            const imgVal = slotNum === 1 ? img1 : slotNum === 2 ? img2 : img3;
                            return (
                              <div key={slotNum} className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-[10px] font-bold text-white block">Foto {slotNum}</span>
                                {imgVal ? (
                                  <img src={imgVal} alt={`Foto ${slotNum}`} className="h-20 w-full object-cover rounded-lg border border-white/20" />
                                ) : (
                                  <div className="h-20 w-full rounded-lg border border-dashed border-white/20 flex items-center justify-center text-white/40 text-[10px]">
                                    Sin foto
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTargetImgSlot(slotNum as any);
                                      fileInputGalleryRef.current?.click();
                                    }}
                                    className="flex-1 bg-[#f70071] hover:bg-[#ff1b82] text-white text-[9px] font-black py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <span>Galería</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTargetImgSlot(slotNum as any);
                                      fileInputCameraRef.current?.click();
                                    }}
                                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white text-[9px] font-black py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Camera className="w-3 h-3" />
                                    <span>Cámara</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Color Selector */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-[#ff96c5]" />
                          <span>Colores Disponibles</span>
                        </label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {AVAILABLE_COLORS.map((c) => {
                            const isSelected = selectedColors.includes(c.name);
                            return (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => toggleColorSelect(c.name)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isSelected ? 'bg-[#f70071] text-white border-2 border-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: c.hex }} />
                                <span>{c.name}</span>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-white">Descripción del Producto</label>
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (!editingId) generateAutoFields(name, e.target.value);
                          }}
                          placeholder="Detalles de flores..."
                          className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        className="px-6 py-3 rounded-full bg-white/10 text-white font-bold text-xs uppercase"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-[#1A1A1A] font-black text-xs uppercase shadow-xl cursor-pointer"
                      >
                        Guardar Producto en BD
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: CUSTOM BOUQUET EDITOR */}
            {activeTab === 'custom_bouquet' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <h4 className="font-syne text-xl font-black text-white">
                    Editor Diseña tu Ramo (Variedades, Colores & Precios)
                  </h4>
                  <button
                    onClick={handleOpenAddFlowerOption}
                    className="bg-[#25D366] text-white font-black text-xs uppercase px-4 py-2 rounded-full"
                  >
                    + Agregar Flor
                  </button>
                </div>

                <form onSubmit={handleSaveFlowerOption} className="bg-[#42082B] p-5 rounded-3xl border border-white/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" required value={flName} onChange={(e) => setFlName(e.target.value)} placeholder="Nombre Flor" className="bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white" />
                    <input type="text" required value={flColorName} onChange={(e) => setFlColorName(e.target.value)} placeholder="Nombre Color" className="bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white" />
                    <input type="number" required value={flPrice} onChange={(e) => setFlPrice(Number(e.target.value))} placeholder="Precio por Tallo" className="bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white" />
                  </div>
                  <button type="submit" className="bg-[#25D366] text-white font-black text-xs uppercase px-6 py-2.5 rounded-xl">
                    Guardar Flor en BD
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: TAXONOMY EDITOR */}
            {activeTab === 'taxonomy' && (
              <div className="space-y-6">
                <h4 className="font-syne text-xl font-black text-white">Editor de Categorías & Subcategorías</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-[#42082B] p-5 rounded-2xl border border-white/20 space-y-3">
                    <span className="text-xs font-black uppercase text-[#ff96c5] block">Crear Categoría Principal</span>
                    <div className="flex gap-2">
                      <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nombre Categoría" className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                      <button onClick={handleAddCategory} className="bg-[#f70071] text-white font-black text-xs px-4 py-2 rounded-xl">Crear</button>
                    </div>
                  </div>

                  <div className="bg-[#42082B] p-5 rounded-2xl border border-white/20 space-y-3">
                    <span className="text-xs font-black uppercase text-[#ffc0dc] block">Agregar Subcategoría</span>
                    <div className="flex gap-2">
                      <input type="text" value={newSubcatName} onChange={(e) => setNewSubcatName(e.target.value)} placeholder="Nombre Subcategoría" className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-2 text-xs font-bold text-white" />
                      <button onClick={handleAddSubcategory} className="bg-[#25D366] text-white font-black text-xs px-4 py-2 rounded-xl">Agregar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
