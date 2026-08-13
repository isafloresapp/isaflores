import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Users, ShoppingBag, Truck, Calendar, Phone, CheckCircle2, Search, ArrowRight, ShieldCheck, Sparkles, Plus, Edit3, Trash2, Image, Tag, Code, Layers, Check, Camera, Mic, Upload, Settings, Sliders, RefreshCw, Palette, Link as LinkIcon, ChevronDown, ChevronRight, FolderTree, Filter } from 'lucide-react';
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

const PRESET_FLOWER_IMAGES = [
  { name: 'Ramo Coral', url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Girasoles', url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=800' },
  { name: 'Novia Blanco', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800' },
  { name: 'Caja Rosas', url: 'https://images.unsplash.com/photo-1548625361-185888258385?auto=format&fit=crop&q=80&w=800' },
];

const EMOJI_OPTIONS = ['💐', '🌻', '💍', '✨', '🎁', '🎨', '🌸', '🌹', '🌿', '🎂', '👑', '🎀'];

export const CrmModal: React.FC<CrmModalProps> = ({ isOpen, onClose, onUpdateProductCatalog }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom_bouquet' | 'taxonomy'>('orders');

  // Database & Refresh State
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom Bouquet Editor State
  const [customFlowers, setCustomFlowers] = useState<CustomFlowerOption[]>([]);
  const [editingFlowerId, setEditingFlowerId] = useState<string | null>(null);
  const [flName, setFlName] = useState('');
  const [flColorName, setFlColorName] = useState('');
  const [flColorHex, setFlColorHex] = useState('#ff96c5');
  const [flPrice, setFlPrice] = useState<number>(1500);
  const [flIcon, setFlIcon] = useState('🌸');

  // Taxonomies State (Categorías Padre / Hijas)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, string[]>>(INITIAL_SUBCATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🌸');
  const [newSubcatInputMap, setNewSubcatInputMap] = useState<Record<string, string>>({});
  const [expandedParentCategories, setExpandedParentCategories] = useState<Record<string, boolean>>({ ramos: true, girasoles: true });

  // Product Filtering & Search State
  const [searchProductFilter, setSearchProductFilter] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState('todos');

  // Product Add / Edit Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(14990);
  const [category, setCategory] = useState('ramos');
  const [subcategory, setSubcategory] = useState('Ramos de Autor');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Nuevo');
  
  // Image Slots
  const [img1, setImg1] = useState('');
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
    setOrders(loadedOrders || []);
    setProductsList(loadedProducts || []);
    setCustomFlowers(loadedCustomFlowers || []);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadDatabaseData();
    if (onUpdateProductCatalog) {
      const freshProducts = await db.getProducts();
      onUpdateProductCatalog(freshProducts || []);
    }
    setTimeout(() => {
      setIsRefreshing(false);
      alert('¡Base de Datos y Catálogo sincronizados con éxito!');
    }, 400);
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

  // Image Compressor for Mobile
  const compressImage = (file: File, callback: (compressedUrl: string) => void) => {
    const reader = new FileReader();
    reader.onerror = () => {
      alert('No se pudo leer el archivo. Intenta con otra foto o pega un enlace de imagen.');
    };
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      const img = new window.Image();
      img.onerror = () => {
        callback(rawResult);
      };
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width || 400;
          let height = img.height || 400;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
            callback(compressedDataUrl || rawResult);
          } else {
            callback(rawResult);
          }
        } catch (e) {
          callback(rawResult);
        }
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  };

  const handleSlotFileUpload = (slotNum: 1 | 2 | 3, file: File | undefined) => {
    if (!file) return;
    compressImage(file, (compressedBase64) => {
      if (slotNum === 1) setImg1(compressedBase64);
      else if (slotNum === 2) setImg2(compressedBase64);
      else if (slotNum === 3) setImg3(compressedBase64);
      alert(`¡Foto ${slotNum} cargada con éxito!`);
    });
  };

  const generateAutoFields = (productName: string, desc: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const safeName = (productName || 'RAM').slice(0, 3).toUpperCase();
    const newSku = `ISA-${safeName}-${randomNum}`;
    const title = `${productName || 'Producto'} | Flores Eternas IsaFlores Chile`;
    const metaDesc = `${desc || productName || 'Producto IsaFlores'} - Hecho a mano en Chile con limpiapipas y goma EVA.`;

    setSku(newSku);
    setMetaTitle(title);
    setMetaDescription(metaDesc);
  };

  const handleOpenAddProduct = () => {
    setEditingId(null);
    setName('');
    setPrice(14990);
    const defaultCat = categories[0]?.id || 'ramos';
    setCategory(defaultCat);
    setSubcategory(subcategoriesMap[defaultCat]?.[0] || 'General');
    setDescription('');
    setBadge('Nuevo');
    setImg1('');
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
    const parentCat = prod.category || categories[0]?.id || 'ramos';
    setCategory(parentCat);
    setSubcategory((prod as any).subcategory || subcategoriesMap[parentCat]?.[0] || 'General');
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
    const parentCategoryObj = categories.find((c) => c.id === category);

    const updatedProduct: any = {
      id: editingId || `prod-${Date.now()}`,
      name: name || 'Ramo Sin Nombre',
      price: price || 0,
      category: category || 'ramos',
      categoryLabel: parentCategoryObj?.label || 'Flores',
      subcategory: subcategory || 'General',
      description: description || '',
      fullDetails: `${description || ''}\n\n• SKU: ${sku}\n• Categoría Padre: ${parentCategoryObj?.label || category}\n• Subcategoría Hija: ${subcategory}\n• Colores disponibles: ${selectedColors.join(', ')}`,
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

    setIsEditingProduct(false);
    alert(`¡Producto "${name}" guardado en la Base de Datos con éxito!`);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (confirm('¿Eliminar este producto de la Base de Datos?')) {
      const newProducts = await db.deleteProduct(prodId);
      setProductsList(newProducts || []);
      if (onUpdateProductCatalog) {
        onUpdateProductCatalog(newProducts || []);
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

  // Taxonomy Handlers (Padre ➔ Hija)
  const handleAddParentCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (categories.some((c) => c.id === catId)) {
      alert('Esta categoría padre ya existe.');
      return;
    }
    const newCategoryObj = { id: catId, label: newCatName, icon: newCatIcon || '🌸' };
    setCategories((prev) => [...prev, newCategoryObj]);
    setSubcategoriesMap((prev) => ({ ...prev, [catId]: ['General'] }));
    setExpandedParentCategories((prev) => ({ ...prev, [catId]: true }));
    setNewCatName('');
    alert(`¡Categoría Padre "${newCatName}" creada con éxito!`);
  };

  const handleAddChildSubcategory = (parentId: string) => {
    const subName = (newSubcatInputMap[parentId] || '').trim();
    if (!subName) return;

    const existingSubcats = subcategoriesMap[parentId] || [];
    if (existingSubcats.includes(subName)) {
      alert('Esta subcategoría ya existe dentro de esta categoría padre.');
      return;
    }

    setSubcategoriesMap((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] || []), subName],
    }));

    setNewSubcatInputMap((prev) => ({ ...prev, [parentId]: '' }));
  };

  const handleDeleteSubcategory = (parentId: string, subName: string) => {
    if (confirm(`¿Eliminar la subcategoría "${subName}" de esta categoría padre?`)) {
      setSubcategoriesMap((prev) => ({
        ...prev,
        [parentId]: (prev[parentId] || []).filter((s) => s !== subName),
      }));
    }
  };

  const handleDeleteParentCategory = (parentId: string) => {
    const catName = categories.find((c) => c.id === parentId)?.label || parentId;
    if (confirm(`¿Eliminar la categoría padre "${catName}" y todas sus subcategorías?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== parentId));
      setSubcategoriesMap((prev) => {
        const next = { ...prev };
        delete next[parentId];
        return next;
      });
    }
  };

  const toggleExpandParentCategory = (parentId: string) => {
    setExpandedParentCategories((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Filtered Products List
  const filteredProducts = productsList.filter((prod) => {
    const matchesSearch =
      (prod.name || '').toLowerCase().includes(searchProductFilter.toLowerCase()) ||
      ((prod as any).sku || '').toLowerCase().includes(searchProductFilter.toLowerCase()) ||
      (prod.categoryLabel || prod.category || '').toLowerCase().includes(searchProductFilter.toLowerCase());

    const matchesCategory =
      selectedParentFilter === 'todos' || prod.category === selectedParentFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-dropdown">
      <div className="bg-[#2B051C] border-2 border-[#f70071]/40 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl text-white text-left relative flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#2B051C]/95 backdrop-blur-xl p-3 sm:p-6 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#f70071] text-white flex items-center justify-center shadow-lg shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-syne text-lg sm:text-2xl font-black text-white leading-tight">
                Panel CRM & Base de Datos
              </h3>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#25D366] block">
                Optimizado para Celulares 📱 & Computadores 💻
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refrescar Base de Datos"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/20 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#ff96c5] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-[10px]">Refrescar BD</span>
            </button>

            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer active:scale-95">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-6 sm:p-10 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto border border-white/20">
              <Lock className="w-8 h-8 text-[#ff96c5]" />
            </div>
            <h4 className="font-syne text-2xl font-black text-white">Acceso Privado CRM</h4>
            <p className="text-xs text-white/70">Ingresa tu clave de administrador para gestionar cotizaciones y catálogo.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña de administrador..."
              className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-xs font-bold text-white text-center outline-none focus:border-[#f70071]"
            />
            <button type="submit" className="w-full bg-[#f70071] hover:bg-[#ff1b82] text-white font-black text-xs uppercase py-3.5 rounded-full shadow-lg cursor-pointer active:scale-95 transition-all">
              Ingresar al CRM
            </button>
          </form>
        ) : (
          /* Authenticated Panel */
          <div className="p-3 sm:p-8 space-y-6 flex-1">

            {/* Mobile Touch-Friendly Dropdown Selector (Visible on Mobile) */}
            <div className="block sm:hidden pb-3 border-b border-white/20">
              <label className="text-[10px] font-black uppercase text-[#ff96c5] block mb-1.5 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Sección del CRM</span>
              </label>
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value as any);
                    setIsEditingProduct(false);
                  }}
                  className="w-full bg-[#42082B] text-white border-2 border-[#f70071] rounded-2xl px-4 py-3 text-xs font-black outline-none shadow-lg appearance-none cursor-pointer"
                >
                  <option value="orders">📋 Cotizaciones ({orders.length})</option>
                  <option value="products">📦 Gestor Productos ({productsList.length})</option>
                  <option value="custom_bouquet">🌸 Diseña tu Ramo ({customFlowers.length})</option>
                  <option value="taxonomy">🏷️ Categorías Padre e Hijas ({categories.length})</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#ff96c5] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Desktop Pill Tabs (Visible on Tablet/Desktop) */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/20 pb-3">
              <button
                onClick={() => { setActiveTab('orders'); setIsEditingProduct(false); }}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-[#f70071] text-white shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Cotizaciones ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'products' ? 'bg-[#25D366] text-white shadow-lg ring-2 ring-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Gestor Productos ({productsList.length})
              </button>

              <button
                onClick={() => { setActiveTab('custom_bouquet'); setIsEditingProduct(false); }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'custom_bouquet' ? 'bg-[#25D366] text-white shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Diseña tu Ramo ({customFlowers.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('taxonomy'); setIsEditingProduct(false); }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'taxonomy' ? 'bg-[#f70071] text-white shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>Categorías Padre e Hijas</span>
              </button>
            </div>

            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-syne text-lg sm:text-xl font-black text-white">Cotizaciones Registradas ({orders.length})</h4>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <ShoppingBag className="w-10 h-10 text-white/40 mx-auto" />
                    <p className="text-xs text-white/70 font-bold">No hay cotizaciones registradas en la Base de Datos.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Mobile Orders Cards */}
                    <div className="grid grid-cols-1 gap-3">
                      {orders.map((o) => {
                        const safePhone = (o.phone || '').replace(/[^0-9]/g, '');
                        const safeTotal = (o.total || 0).toLocaleString('es-CL');
                        return (
                          <div key={o.id || Math.random().toString()} className="bg-[#42082B] p-4 rounded-2xl border border-white/20 space-y-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <div>
                                <span className="text-[10px] font-black text-[#ff96c5] uppercase block">{o.id || 'ORD-00'}</span>
                                <h5 className="font-syne text-sm font-bold text-white">{o.customerName || 'Cliente'}</h5>
                              </div>
                              <span className="text-sm font-black text-[#25D366] bg-[#25D366]/10 px-3 py-1 rounded-full border border-[#25D366]/30">
                                ${safeTotal} CLP
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80">
                              <div>
                                <span className="text-[10px] font-bold text-white/50 block">Teléfono & Dirección:</span>
                                <p className="font-semibold">{o.phone || 'Sin teléfono'}</p>
                                <p className="text-[11px] text-white/60 truncate">{o.addressComuna || 'Sin dirección'}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-white/50 block">Detalles:</span>
                                <p className="text-[11px] text-[#ff96c5] truncate">{o.productName || 'Ramo personal'}</p>
                                {o.notes && <p className="text-[10px] italic text-white/60">"{o.notes}"</p>}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-white/60">Estado:</span>
                                <select
                                  value={o.status || 'pendiente'}
                                  onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                                  className="flex-1 sm:flex-none bg-[#2B051C] text-xs font-bold text-white border border-white/30 rounded-xl px-3 py-1.5 outline-none"
                                >
                                  <option value="pendiente">⏳ Pendiente</option>
                                  <option value="en_preparacion">⚙️ En Taller</option>
                                  <option value="despachado">✓ Despachado</option>
                                  <option value="cancelado">❌ Cancelado</option>
                                </select>
                              </div>

                              <a
                                href={`https://wa.me/${safePhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center"
                              >
                                <span>Contactar por WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRODUCTS MANAGER */}
            {activeTab === 'products' && (
              <div className="space-y-5">
                {!isEditingProduct ? (
                  /* Products List View */
                  <div className="space-y-4">
                    <div className="bg-[#42082B] p-4 sm:p-5 rounded-3xl border-2 border-[#25D366] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
                      <div>
                        <h4 className="font-syne text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-[#25D366]" />
                          <span>Gestor de Productos ({filteredProducts.length})</span>
                        </h4>
                        <span className="text-[10px] text-[#ff96c5] font-bold block mt-0.5">
                          Administra tus productos, precios e imágenes de forma sencilla desde tu celular
                        </span>
                      </div>

                      <button
                        onClick={handleOpenAddProduct}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-2xl cursor-pointer transform active:scale-95 transition-all shrink-0"
                      >
                        <Plus className="w-5 h-5 text-white" />
                        <span>+ Crear Producto</span>
                      </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                      {/* Search Box */}
                      <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-white/50 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          value={searchProductFilter}
                          onChange={(e) => setSearchProductFilter(e.target.value)}
                          placeholder="Buscar producto por nombre o SKU..."
                          className="w-full bg-[#2B051C] border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                        />
                      </div>

                      {/* Dropdown Filter by Parent Category */}
                      <div className="relative flex items-center">
                        <Filter className="w-4 h-4 text-[#ff96c5] absolute left-3 pointer-events-none" />
                        <select
                          value={selectedParentFilter}
                          onChange={(e) => setSelectedParentFilter(e.target.value)}
                          className="w-full bg-[#2B051C] border border-white/20 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-white outline-none appearance-none cursor-pointer"
                        >
                          <option value="todos">📦 Todas las Categorías Padre ({productsList.length})</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.icon} {c.label} ({productsList.filter((p) => p.category === c.id).length})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                      <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs text-white/70 font-bold">No se encontraron productos con los filtros aplicados.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((prod) => {
                          const parentCat = categories.find((c) => c.id === prod.category);
                          const subcatName = (prod as any).subcategory || 'General';

                          return (
                            <div key={prod.id} className="bg-[#42082B] p-4 rounded-2xl border border-white/20 flex flex-col justify-between space-y-3 shadow-md">
                              <div className="flex gap-3">
                                <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-xl border border-white/20 shrink-0" />
                                <div className="overflow-hidden space-y-0.5">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className="text-[9px] font-black text-[#ff96c5] uppercase bg-white/10 px-1.5 py-0.5 rounded">
                                      {parentCat?.icon || '💐'} {parentCat?.label || prod.category}
                                    </span>
                                    <span className="text-[9px] font-bold text-white/70 bg-white/5 px-1.5 py-0.5 rounded">
                                      {subcatName}
                                    </span>
                                  </div>
                                  <h5 className="font-syne text-sm font-bold text-white truncate pt-1">{prod.name}</h5>
                                  <span className="text-sm font-black text-[#25D366] block">${(prod.price || 0).toLocaleString('es-CL')} CLP</span>
                                  <span className="text-[9px] text-white/50 block">SKU: {(prod as any).sku || `ISA-${(prod.id || 'PROD').slice(0, 4).toUpperCase()}-2026`}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="flex-1 bg-white/10 hover:bg-[#f70071] text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="bg-red-500/20 hover:bg-red-600 text-white text-xs font-black p-2.5 rounded-xl cursor-pointer active:scale-95 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Add / Edit Product Form */
                  <form onSubmit={handleSaveProduct} className="bg-[#42082B] p-4 sm:p-6 rounded-3xl border border-white/20 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                      <div>
                        <h4 className="font-syne text-lg sm:text-xl font-black text-white">
                          {editingId ? `Editar: ${name}` : '✨ Crear Nuevo Producto'}
                        </h4>
                        <span className="text-[10px] text-[#ff96c5] font-bold block">
                          Formulario optimizado con jerarquía de categorías Padre y Subcategorías Hijas
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        className="text-xs font-black text-white/70 hover:text-white bg-white/10 px-3 py-1.5 rounded-full"
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

                      {/* SIMPLIFIED CASCADED CATEGORIES: PARENT CATEGORY */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ff96c5] flex items-center gap-1.5">
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>1. Categoría Padre *</span>
                        </label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              setCategory(newCat);
                              const subcats = subcategoriesMap[newCat] || ['General'];
                              setSubcategory(subcats[0] || 'General');
                            }}
                            className="w-full bg-[#2B051C] border-2 border-[#f70071]/60 rounded-xl px-4 py-2.5 text-xs font-black text-white outline-none appearance-none cursor-pointer"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id} className="bg-[#2B051C] text-white">
                                {c.icon} {c.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-[#ff96c5] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* SIMPLIFIED CASCADED CATEGORIES: CHILD SUBCATEGORY */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ffc0dc] flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>2. Subcategoría Hija *</span>
                        </label>
                        <div className="relative">
                          <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full bg-[#2B051C] border-2 border-white/30 rounded-xl px-4 py-2.5 text-xs font-black text-white outline-none appearance-none cursor-pointer"
                          >
                            {(subcategoriesMap[category] || ['General']).map((sub) => (
                              <option key={sub} value={sub} className="bg-[#2B051C] text-white">
                                • {sub}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Breadcrumb Tag Indicator */}
                      <div className="sm:col-span-2 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs">
                        <span className="text-[10px] font-bold text-white/60">Jerarquía Seleccionada:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-[#f70071] text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                            {categories.find((c) => c.id === category)?.icon} {categories.find((c) => c.id === category)?.label}
                          </span>
                          <span className="text-white/40">➔</span>
                          <span className="bg-[#25D366] text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                            {subcategory}
                          </span>
                        </div>
                      </div>

                      {/* Image Slots */}
                      <div className="sm:col-span-2 space-y-4 bg-[#2B051C] p-4 sm:p-5 rounded-2xl border border-white/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#ff96c5] flex items-center gap-1.5">
                            <Image className="w-4 h-4" />
                            <span>Imágenes del Producto (Galería / Cámara / URL)</span>
                          </span>
                        </div>

                        {/* Presets */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-white/70 font-bold block">Preset rápido de ejemplo:</span>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_FLOWER_IMAGES.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setImg1(preset.url)}
                                className="px-2.5 py-1 bg-white/10 hover:bg-[#f70071] text-white text-[9px] font-bold rounded-lg transition-all cursor-pointer"
                              >
                                🌸 {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {([1, 2, 3] as const).map((slotNum) => {
                            const imgVal = slotNum === 1 ? img1 : slotNum === 2 ? img2 : img3;
                            const setImgFn = slotNum === 1 ? setImg1 : slotNum === 2 ? setImg2 : setImg3;
                            const galleryInputId = `gallery-input-slot-${slotNum}`;
                            const cameraInputId = `camera-input-slot-${slotNum}`;

                            return (
                              <div key={slotNum} className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold text-white">Foto {slotNum} {slotNum === 1 ? '(Principal *)' : ''}</span>
                                    {imgVal && (
                                      <button type="button" onClick={() => setImgFn('')} className="text-[9px] text-red-400 hover:underline">
                                        Borrar
                                      </button>
                                    )}
                                  </div>

                                  {imgVal ? (
                                    <div className="relative group">
                                      <img src={imgVal} alt={`Foto ${slotNum}`} className="h-24 w-full object-cover rounded-lg border border-white/20" />
                                      <span className="absolute bottom-1 right-1 bg-black/70 text-[8px] text-[#25D366] font-black px-1.5 py-0.5 rounded-md">
                                        ✓ Cargada
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="h-24 w-full rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 text-[10px] gap-1 bg-white/5">
                                      <Image className="w-5 h-5 text-white/30" />
                                      <span>Sin foto</span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-1.5 pt-1 border-t border-white/10">
                                  <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 border border-white/20">
                                    <LinkIcon className="w-3 h-3 text-[#ff96c5] shrink-0" />
                                    <input
                                      type="url"
                                      value={imgVal}
                                      onChange={(e) => setImgFn(e.target.value)}
                                      placeholder="Pega enlace URL..."
                                      className="w-full text-[10px] bg-transparent text-white outline-none font-medium"
                                    />
                                  </div>

                                  <input
                                    id={galleryInputId}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      handleSlotFileUpload(slotNum, file);
                                      e.target.value = '';
                                    }}
                                    className="hidden"
                                  />

                                  <input
                                    id={cameraInputId}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      handleSlotFileUpload(slotNum, file);
                                      e.target.value = '';
                                    }}
                                    className="hidden"
                                  />

                                  <div className="grid grid-cols-2 gap-1 pt-1">
                                    <label
                                      htmlFor={galleryInputId}
                                      className="bg-[#f70071] hover:bg-[#ff1b82] text-white text-[9px] font-black py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer text-center select-none active:scale-95 transition-transform"
                                    >
                                      <Upload className="w-3 h-3" />
                                      <span>Galería</span>
                                    </label>

                                    <label
                                      htmlFor={cameraInputId}
                                      className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[9px] font-black py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer text-center select-none active:scale-95 transition-transform"
                                    >
                                      <Camera className="w-3 h-3" />
                                      <span>Cámara</span>
                                    </label>
                                  </div>
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

                    {/* Mobile Action Save Bar */}
                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 bg-[#42082B] p-2 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 text-white font-bold text-xs uppercase cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase shadow-2xl cursor-pointer active:scale-95 transition-all text-center"
                      >
                        💾 Guardar Producto en BD
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: CUSTOM BOUQUET EDITOR */}
            {activeTab === 'custom_bouquet' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/20 pb-4 gap-3">
                  <div>
                    <h4 className="font-syne text-lg sm:text-xl font-black text-white">
                      Diseña tu Ramo (Variedades, Colores & Precios)
                    </h4>
                    <span className="text-[10px] text-[#ff96c5] font-bold">Configura los insumos y precios por tallo</span>
                  </div>
                  <button
                    onClick={handleOpenAddFlowerOption}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase px-4 py-2.5 rounded-full cursor-pointer active:scale-95 transition-all"
                  >
                    + Agregar Flor
                  </button>
                </div>

                <form onSubmit={handleSaveFlowerOption} className="bg-[#42082B] p-4 sm:p-5 rounded-3xl border border-white/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" required value={flName} onChange={(e) => setFlName(e.target.value)} placeholder="Nombre Flor (Ej: Rosa Limpiapipa)" className="bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none" />
                    <input type="text" required value={flColorName} onChange={(e) => setFlColorName(e.target.value)} placeholder="Nombre Color (Ej: Fucsia)" className="bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none" />
                    <input type="number" required value={flPrice} onChange={(e) => setFlPrice(Number(e.target.value))} placeholder="Precio por Tallo ($)" className="bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none" />
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase px-6 py-3 rounded-xl cursor-pointer active:scale-95 transition-all">
                    Guardar Flor en BD
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {customFlowers.map((fl) => (
                    <div key={fl.id} className="bg-[#42082B] p-3 rounded-2xl border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{fl.iconSvg || '🌸'}</span>
                        <div>
                          <h5 className="font-bold text-xs text-white">{fl.name}</h5>
                          <span className="text-[10px] text-[#ff96c5] block">{fl.colorName} • ${(fl.pricePerStem || 0).toLocaleString('es-CL')} / tallo</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TAXONOMY EDITOR (Categorías Padre ➔ Categorías Hijas) */}
            {activeTab === 'taxonomy' && (
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-3">
                  <h4 className="font-syne text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-[#f70071]" />
                    <span>Estructura de Categorías Padre e Hijas</span>
                  </h4>
                  <p className="text-xs text-[#ff96c5] font-semibold mt-1">
                    Gestiona las categorías principales (Padres) y sus subcategorías secundarias (Hijas) que aparecen en la tienda y en el creador de productos.
                  </p>
                </div>

                {/* Form to Create New Parent Category */}
                <form onSubmit={handleAddParentCategory} className="bg-[#42082B] p-4 sm:p-5 rounded-3xl border-2 border-[#f70071]/60 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#f70071] text-white flex items-center justify-center font-black text-xs">
                      1
                    </span>
                    <h5 className="font-syne text-sm font-black text-white">Crear Nueva Categoría Padre (Principal)</h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Emoji Selector */}
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-white/70 block mb-1">Icono / Emoji</label>
                      <select
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                      >
                        {EMOJI_OPTIONS.map((emoji) => (
                          <option key={emoji} value={emoji}>
                            {emoji} Icono {emoji}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Name Input */}
                    <div className="sm:col-span-6">
                      <label className="text-[10px] font-bold text-white/70 block mb-1">Nombre de Categoría Padre *</label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Ej: Rosas & Claveles"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-3 flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-[#f70071] hover:bg-[#ff1b82] text-white font-black text-xs uppercase py-3 rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all"
                      >
                        + Crear Padre
                      </button>
                    </div>
                  </div>
                </form>

                {/* Hierarchical Tree List of Parent & Child Categories */}
                <div className="space-y-4 pt-2">
                  <h5 className="font-syne text-sm font-black text-white uppercase tracking-wider">
                    📂 Categorías Padre Existentes ({categories.length})
                  </h5>

                  <div className="grid grid-cols-1 gap-4">
                    {categories.map((parentCat) => {
                      const childSubcats = subcategoriesMap[parentCat.id] || [];
                      const isExpanded = expandedParentCategories[parentCat.id] ?? true;
                      const productCount = productsList.filter((p) => p.category === parentCat.id).length;

                      return (
                        <div key={parentCat.id} className="bg-[#42082B] rounded-3xl border border-white/20 overflow-hidden shadow-lg">
                          {/* Parent Category Card Header */}
                          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleExpandParentCategory(parentCat.id)}
                                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-[#ff96c5]" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                              </button>
                              <span className="text-2xl">{parentCat.icon}</span>
                              <div>
                                <h6 className="font-syne text-base font-black text-white">{parentCat.label}</h6>
                                <span className="text-[10px] text-[#ff96c5] font-bold block">
                                  ID: {parentCat.id} • {productCount} producto{productCount !== 1 ? 's' : ''} asignado{productCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteParentCategory(parentCat.id)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/30 cursor-pointer"
                              title="Eliminar esta categoría padre"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                              <span className="hidden sm:inline">Eliminar</span>
                            </button>
                          </div>

                          {/* Child Subcategories Body */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 space-y-4 bg-[#2B051C]/60">
                              <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-[#ffc0dc] block flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  <span>Subcategorías Hijas ({childSubcats.length})</span>
                                </span>

                                {childSubcats.length === 0 ? (
                                  <p className="text-xs text-white/50 italic">No hay subcategorías hijas creadas en esta categoría.</p>
                                ) : (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {childSubcats.map((subName) => (
                                      <div
                                        key={subName}
                                        className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-bold text-white flex items-center gap-2 group"
                                      >
                                        <span>• {subName}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSubcategory(parentCat.id, subName)}
                                          className="w-4 h-4 rounded-full bg-red-500/30 hover:bg-red-500 text-white flex items-center justify-center text-[10px] font-black cursor-pointer"
                                          title={`Eliminar subcategoría ${subName}`}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Form to Add Child Subcategory directly to this Parent */}
                              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newSubcatInputMap[parentCat.id] || ''}
                                  onChange={(e) =>
                                    setNewSubcatInputMap((prev) => ({
                                      ...prev,
                                      [parentCat.id]: e.target.value,
                                    }))
                                  }
                                  placeholder={`+ Nueva Subcategoría Hija para "${parentCat.label}"...`}
                                  className="flex-1 bg-white/10 border border-white/30 rounded-xl px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#25D366]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddChildSubcategory(parentCat.id)}
                                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all shrink-0"
                                >
                                  + Agregar Hija
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
