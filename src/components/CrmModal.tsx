import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Users, ShoppingBag, Truck, Calendar, Phone, CheckCircle2, Search, ArrowRight, ShieldCheck, Sparkles, Plus, Edit3, Trash2, Image, Tag, Code, Layers, Check, Camera, Mic, Upload, Settings, Sliders, RefreshCw, Palette, Link as LinkIcon, ChevronDown, ChevronRight, FolderTree, Filter, Save, Calculator, TrendingUp, DollarSign, Cpu, Percent, Clock, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { db, DbOrder, CustomFlowerOption, SliderItem, INITIAL_SLIDERS } from '../services/db';

interface CrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProductCatalog?: (updatedProducts: Product[]) => void;
}

const INITIAL_CATEGORIES = [
  { id: 'flores-temporada', label: 'Flores Temporada', icon: '🌺' },
  { id: 'ramos', label: 'Ramos Eternos', icon: '💐' },
  { id: 'girasoles', label: 'Girasoles', icon: '🌻' },
  { id: 'bodas', label: 'Bodas & Novias', icon: '💍' },
  { id: 'eventos', label: 'Eventos', icon: '✨' },
  { id: 'regalos', label: 'Regalos', icon: '🎁' },
  { id: 'kits', label: 'Kits DIY', icon: '🎨' },
];

const INITIAL_SUBCATEGORIES: Record<string, string[]> = {
  'flores-temporada': ['Rosas', 'Liliums', 'Girasoles', 'Gerberas', 'Tulipanes', 'Maules', 'Flor de Lavanda', 'Espiga de Trigo'],
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

const EMOJI_OPTIONS = ['💐', '🌻', '💍', '✨', '🎁', '🎨', '🌸', '🌹', '🌿', '🎂', '👑', '🎀', '🌷', '🌼', '🌺'];

export const CrmModal: React.FC<CrmModalProps> = ({ isOpen, onClose, onUpdateProductCatalog }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom_bouquet' | 'taxonomy' | 'financial_ai' | 'sliders'>('orders');

  // Database & Refresh State
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sliders Carousel State (3 Banners)
  const [sliders, setSliders] = useState<SliderItem[]>(INITIAL_SLIDERS);

  // Custom Bouquet Editor State
  const [customFlowers, setCustomFlowers] = useState<CustomFlowerOption[]>([]);
  const [editingFlowerId, setEditingFlowerId] = useState<string | null>(null);
  const [flName, setFlName] = useState('');
  const [flColorName, setFlColorName] = useState('');
  const [flColorHex, setFlColorHex] = useState('#ff96c5');
  const [flPrice, setFlPrice] = useState<number>(1500);
  const [flIcon, setFlIcon] = useState('🌸');

  // Financial AI Calculator State (Motor Lógico de Inteligencia Financiera)
  const [finNombreFlor, setFinNombreFlor] = useState('Ramo de Rosas Eternas Limpiapipas');
  const [finCostoMateriales, setFinCostoMateriales] = useState<number>(3500);
  const [finTiempoMinutos, setFinTiempoMinutos] = useState<number>(45);
  const [finTarifaHora, setFinTarifaHora] = useState<number>(4000);
  const [finCostoEmpaque, setFinCostoEmpaque] = useState<number>(800);
  const [finMargenDeseado, setFinMargenDeseado] = useState<number>(60);

  // Taxonomies State (Categorías Padre / Hijas)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, string[]>>(INITIAL_SUBCATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🌸');
  const [newSubcatInputMap, setNewSubcatInputMap] = useState<Record<string, string>>({});
  const [expandedParentCategories, setExpandedParentCategories] = useState<Record<string, boolean>>({ 'flores-temporada': true, ramos: true, girasoles: true });

  // Subcategory & Parent Edit Mode States
  const [editingSubcatKey, setEditingSubcatKey] = useState<{ parentId: string; oldSubName: string } | null>(null);
  const [editingSubcatText, setEditingSubcatText] = useState('');

  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editingParentLabel, setEditingParentLabel] = useState('');

  // Product Filtering & Search State
  const [searchProductFilter, setSearchProductFilter] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState('todos');

  // Product Add / Edit Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(14990);
  const [category, setCategory] = useState('flores-temporada');
  const [subcategory, setSubcategory] = useState('Rosas');
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

  // FINANCIAL AI ENGINE CALCULATIONS (Obligatorias según especificaciones)
  const finCostoLaboral = (finTarifaHora / 60) * finTiempoMinutos;
  const finCostoBase = finCostoMateriales + finCostoLaboral + finCostoEmpaque;
  const finCostoOperativoExtra = finCostoBase * 0.05; // 5% herramientas, luz, desgaste
  const finCostoTotalReal = finCostoBase + finCostoOperativoExtra;

  const finMargenDecimal = finMargenDeseado / 100;
  const finPrecioSugeridoRaw = finMargenDecimal < 1 ? finCostoTotalReal / (1 - finMargenDecimal) : finCostoTotalReal * 2;
  const finPrecioSugerido = Math.ceil(finPrecioSugeridoRaw); // Redondeo entero superior
  const finUtilidadNeta = finPrecioSugerido - finCostoTotalReal;
  const finGananciaPorMinuto = finTiempoMinutos > 0 ? finUtilidadNeta / finTiempoMinutos : 0;

  let finViabilidad: 'Alta' | 'Media' | 'Baja' = 'Alta';
  let finAdvertencia = '';
  if (finMargenDecimal < 0.40) {
    finViabilidad = 'Baja';
    finAdvertencia = '⚠️ Margen < 40%: La viabilidad es baja. El trabajo artesanal manual no está siendo bien remunerado.';
  } else if (finMargenDecimal < 0.55) {
    finViabilidad = 'Media';
    finAdvertencia = '⚡ Margen Aceptable: Se sugiere revisar tiempos o insumos para optimizar la rentabilidad.';
  } else {
    finViabilidad = 'Alta';
    finAdvertencia = '✨ Excelente Rentabilidad: El precio cubre holgadamente materiales, mano de obra e imprevistos.';
  }

  const finSugerenciaComercial = finViabilidad === 'Baja'
    ? 'Atención: Incrementa la tarifa por hora o reduce minutos de confección para lograr utilidad saludable.'
    : `Producto rentable. Genera $${Math.round(finGananciaPorMinuto)}/min. Excelente para venta directa e ecommerce.`;

  const finJsonResponse = {
    producto: {
      nombre: finNombreFlor,
      resumen_costos: {
        materiales_y_empaque: Number((finCostoMateriales + finCostoEmpaque).toFixed(2)),
        mano_de_obra: Number(finCostoLaboral.toFixed(2)),
        costos_indirectos: Number(finCostoOperativoExtra.toFixed(2)),
        total_produccion: Number(finCostoTotalReal.toFixed(2))
      },
      pricing: {
        precio_sugerido: finPrecioSugerido,
        utilidad_neta_estimada: Number(finUtilidadNeta.toFixed(2)),
        margen_aplicado: `${finMargenDeseado}%`
      },
      metricas_eficiencia: {
        ganancia_por_minuto: Number(finGananciaPorMinuto.toFixed(2)),
        viabilidad: finViabilidad
      },
      sugerencia_comercial: finSugerenciaComercial
    }
  };

  const handleApplyFinProductToCatalog = () => {
    setEditingId(null);
    setName(finNombreFlor || 'Ramo Limpiapipas');
    setPrice(finPrecioSugerido || 14990);
    setDescription(`Detalles de costos calculados por Motor Financiero IA:\n• Costo Insumos & Empaque: $${Math.round(finCostoMateriales + finCostoEmpaque)} CLP\n• Minutos confección: ${finTiempoMinutos} min\n• Utilidad Neta: $${Math.round(finUtilidadNeta)} CLP (${finMargenDeseado}%)\n• Ganancia por minuto: $${Math.round(finGananciaPorMinuto)} CLP/min`);
    setBadge('Destacado');
    setActiveTab('products');
    setIsEditingProduct(true);
    alert(`¡Precio sugerido ($${finPrecioSugerido.toLocaleString('es-CL')} CLP) precargado en el Gestor de Productos!`);
  };

  useEffect(() => {
    if (isOpen) {
      loadDatabaseData();
    }
  }, [isOpen]);

  const loadDatabaseData = async () => {
    const loadedOrders = await db.getOrders();
    const loadedProducts = await db.getProducts();
    const loadedCustomFlowers = await db.getCustomFlowers();
    const loadedTaxonomies = await db.getTaxonomies();
    const loadedSliders = await db.getSliders();

    setOrders(loadedOrders || []);
    setProductsList(loadedProducts || []);
    setCustomFlowers(loadedCustomFlowers || []);
    if (loadedSliders && loadedSliders.length > 0) {
      setSliders(loadedSliders);
    }

    let finalCategories = INITIAL_CATEGORIES;
    let finalSubcats = INITIAL_SUBCATEGORIES;

    if (loadedTaxonomies && loadedTaxonomies.categories && loadedTaxonomies.categories.length > 0) {
      finalCategories = loadedTaxonomies.categories;
      finalSubcats = loadedTaxonomies.subcategoriesMap || INITIAL_SUBCATEGORIES;

      // Ensure 'flores-temporada' is included in cloud taxonomy
      if (!finalCategories.some((c) => c.id === 'flores-temporada')) {
        finalCategories = [{ id: 'flores-temporada', label: 'Flores Temporada', icon: '🌺' }, ...finalCategories];
        finalSubcats['flores-temporada'] = ['Rosas', 'Liliums', 'Girasoles', 'Gerberas', 'Tulipanes', 'Maules', 'Flor de Lavanda', 'Espiga de Trigo'];
        await db.saveTaxonomies({ categories: finalCategories, subcategoriesMap: finalSubcats });
      }
    } else {
      await db.saveTaxonomies({ categories: INITIAL_CATEGORIES, subcategoriesMap: INITIAL_SUBCATEGORIES });
    }

    setCategories(finalCategories);
    setSubcategoriesMap(finalSubcats);
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
      alert('¡Base de Datos Nube (Supabase) y Catálogo sincronizados con éxito entre Celular y Computador!');
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
    const defaultCat = categories[0]?.id || 'flores-temporada';
    setCategory(defaultCat);
    setSubcategory(subcategoriesMap[defaultCat]?.[0] || 'Rosas');
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
    const parentCat = prod.category || categories[0]?.id || 'flores-temporada';
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
      category: category || 'flores-temporada',
      categoryLabel: parentCategoryObj?.label || 'Flores Temporada',
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
    alert(`¡Producto "${name}" guardado en la Nube Supabase con éxito!`);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (confirm('¿Eliminar este producto de la Nube de Supabase?')) {
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

  // Custom Bouquet Flower Options Handlers (Add, Edit & Delete)
  const handleOpenAddFlowerOption = () => {
    setEditingFlowerId(null);
    setFlName('');
    setFlColorName('Rosa Pastel');
    setFlColorHex('#ff96c5');
    setFlPrice(1500);
    setFlIcon('🌸');
  };

  const handleOpenEditFlowerOption = (fl: CustomFlowerOption) => {
    setEditingFlowerId(fl.id);
    setFlName(fl.name || '');
    setFlColorName(fl.colorName || '');
    setFlColorHex(fl.colorHex || '#ff96c5');
    setFlPrice(fl.pricePerStem || 0);
    setFlIcon(fl.iconSvg || '🌸');
  };

  const handleDeleteFlowerOption = async (flId: string) => {
    const target = customFlowers.find((f) => f.id === flId);
    if (confirm(`¿Eliminar la flor "${target?.name || 'seleccionada'}" de la Nube de Supabase?`)) {
      const updatedList = customFlowers.filter((f) => f.id !== flId);
      await db.saveCustomFlowers(updatedList);
      setCustomFlowers(updatedList);
      if (editingFlowerId === flId) {
        handleOpenAddFlowerOption();
      }
    }
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
    setFlColorName('');
    setFlPrice(1500);
    alert(`¡Opción de flor "${flName}" guardada en la Nube Supabase con éxito!`);
  };

  // Order Status Handler
  const handleStatusChange = async (orderId: string, newStatus: DbOrder['status']) => {
    const updated = await db.updateOrderStatus(orderId, newStatus);
    setOrders(updated || []);
  };

  // Taxonomy Handlers (Padre ➔ Hija) - Persisted to Supabase Cloud
  const handleAddParentCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (categories.some((c) => c.id === catId)) {
      alert('Esta categoría padre ya existe.');
      return;
    }
    const newCategoryObj = { id: catId, label: newCatName, icon: newCatIcon || '🌸' };
    const updatedCategories = [...categories, newCategoryObj];
    const updatedSubcats = { ...subcategoriesMap, [catId]: ['General'] };

    setCategories(updatedCategories);
    setSubcategoriesMap(updatedSubcats);
    setExpandedParentCategories((prev) => ({ ...prev, [catId]: true }));
    setNewCatName('');

    await db.saveTaxonomies({ categories: updatedCategories, subcategoriesMap: updatedSubcats });
    alert(`¡Categoría Padre "${newCatName}" guardada en la Nube Supabase!`);
  };

  const handleSaveEditedParentCategory = async (parentId: string, newLabel: string) => {
    const trimmed = newLabel.trim();
    if (!trimmed) {
      alert('El nombre de la categoría padre no puede estar vacío.');
      return;
    }

    const updatedCategories = categories.map((c) =>
      c.id === parentId ? { ...c, label: trimmed } : c
    );

    setCategories(updatedCategories);
    setEditingParentId(null);
    setEditingParentLabel('');

    await db.saveTaxonomies({ categories: updatedCategories, subcategoriesMap });
    alert(`¡Categoría Padre "${trimmed}" actualizada y guardada en la Nube Supabase!`);
  };

  const handleAddChildSubcategory = async (parentId: string) => {
    const subName = (newSubcatInputMap[parentId] || '').trim();
    if (!subName) return;

    const existingSubcats = subcategoriesMap[parentId] || [];
    if (existingSubcats.includes(subName)) {
      alert('Esta subcategoría ya existe dentro de esta categoría padre.');
      return;
    }

    const updatedSubcats = {
      ...subcategoriesMap,
      [parentId]: [...(subcategoriesMap[parentId] || []), subName],
    };

    setSubcategoriesMap(updatedSubcats);
    setNewSubcatInputMap((prev) => ({ ...prev, [parentId]: '' }));

    await db.saveTaxonomies({ categories, subcategoriesMap: updatedSubcats });
  };

  const handleSaveEditedSubcategory = async (parentId: string, oldSubName: string, newSubName: string) => {
    const trimmedNew = newSubName.trim();
    if (!trimmedNew) {
      alert('El nombre de la subcategoría no puede estar vacío.');
      return;
    }

    const currentSubcats = subcategoriesMap[parentId] || [];
    if (trimmedNew !== oldSubName && currentSubcats.includes(trimmedNew)) {
      alert('Ya existe una subcategoría con este nombre dentro de esta categoría padre.');
      return;
    }

    const updatedSubcats = {
      ...subcategoriesMap,
      [parentId]: currentSubcats.map((s) => (s === oldSubName ? trimmedNew : s)),
    };

    setSubcategoriesMap(updatedSubcats);
    setEditingSubcatKey(null);
    setEditingSubcatText('');

    await db.saveTaxonomies({ categories, subcategoriesMap: updatedSubcats });
    alert(`¡Subcategoría "${trimmedNew}" actualizada y guardada en la Nube Supabase!`);
  };

  const handleDeleteSubcategory = async (parentId: string, subName: string) => {
    if (confirm(`¿Eliminar la subcategoría "${subName}" de esta categoría padre?`)) {
      const updatedSubcats = {
        ...subcategoriesMap,
        [parentId]: (subcategoriesMap[parentId] || []).filter((s) => s !== subName),
      };

      setSubcategoriesMap(updatedSubcats);
      await db.saveTaxonomies({ categories, subcategoriesMap: updatedSubcats });
    }
  };

  const handleDeleteParentCategory = async (parentId: string) => {
    const catName = categories.find((c) => c.id === parentId)?.label || parentId;
    if (confirm(`¿Eliminar la categoría padre "${catName}" y todas sus subcategorías?`)) {
      const updatedCategories = categories.filter((c) => c.id !== parentId);
      const updatedSubcats = { ...subcategoriesMap };
      delete updatedSubcats[parentId];

      setCategories(updatedCategories);
      setSubcategoriesMap(updatedSubcats);

      await db.saveTaxonomies({ categories: updatedCategories, subcategoriesMap: updatedSubcats });
    }
  };

  const toggleExpandParentCategory = (parentId: string) => {
    setExpandedParentCategories((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Sliders Carousel Handlers
  const handleSliderChange = (idx: number, field: keyof SliderItem, value: any) => {
    const updated = [...sliders];
    updated[idx] = { ...updated[idx], [field]: value };
    setSliders(updated);
  };

  const handleSliderHighlightChange = (sliderIdx: number, hlIdx: number, value: string) => {
    const updated = [...sliders];
    const newHighlights = [...(updated[sliderIdx].highlights || [])];
    newHighlights[hlIdx] = value;
    updated[sliderIdx] = { ...updated[sliderIdx], highlights: newHighlights };
    setSliders(updated);
  };

  const handleSaveSliders = async () => {
    await db.saveSliders(sliders);
    alert('🎉 ¡Los 3 Banners/Sliders han sido guardados e integrados en la Nube Supabase con éxito!');
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
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#25D366] block flex items-center gap-1">
                <RefreshCw className="w-3 h-3 inline text-[#25D366]" />
                <span>Sincronización Cloud Supabase Real-Time (Celular ↔ PC)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refrescar y Sincronizar Base de Datos Supabase"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white text-xs font-bold transition-all cursor-pointer border border-[#25D366]/50 active:scale-95 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#25D366] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-black uppercase">Refrescar Nube</span>
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
                  <option value="financial_ai">🧮 Motor IA Financiero & Precios</option>
                  <option value="custom_bouquet">🌸 Diseña tu Ramo ({customFlowers.length})</option>
                  <option value="taxonomy">🏷️ Categorías Padre e Hijas ({categories.length})</option>
                  <option value="sliders">🖼️ Editar Sliders ({sliders.length})</option>
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
                onClick={() => { setActiveTab('financial_ai'); setIsEditingProduct(false); }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'financial_ai' ? 'bg-[#EAB308] text-black shadow-lg ring-2 ring-white font-extrabold' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Motor IA Financiero</span>
              </button>

              <button
                onClick={() => { setActiveTab('sliders'); setIsEditingProduct(false); }}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black uppercase transition-all cursor-pointer ${
                  activeTab === 'sliders' ? 'bg-[#9C27B0] text-white shadow-lg ring-2 ring-white font-extrabold' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#ffc0dc]" />
                <span>Editar Sliders ({sliders.length})</span>
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
                          Administra tus productos, precios e imágenes de forma sencilla desde tu celular o computador
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

            {/* TAB 3: FINANCIAL AI PRICING ENGINE (Motor Lógico de Inteligencia Financiera) */}
            {activeTab === 'financial_ai' && (
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-syne text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-[#EAB308]" />
                      <span>Motor Lógico de Inteligencia Financiera</span>
                    </h4>
                    <p className="text-xs text-[#ff96c5] font-bold mt-1">
                      Algoritmo de cálculo de costos reales, mano de obra, gastos indirectos y margen de utilidad neta para artesanías en limpiapipas.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex bg-[#EAB308]/20 border border-[#EAB308]/50 text-[#EAB308] text-[10px] font-black uppercase px-3 py-1.5 rounded-full items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> Vertex AI Logic
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Input Form Data */}
                  <div className="lg:col-span-6 bg-[#42082B] p-5 rounded-3xl border border-white/20 space-y-4 shadow-xl">
                    <h5 className="font-syne text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                      <Sliders className="w-4 h-4 text-[#ff96c5]" />
                      <span>Parámetros del Producto / Insumos</span>
                    </h5>

                    {/* Nombre del Ramo */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white">Nombre de la Flor / Ramo</label>
                      <input
                        type="text"
                        value={finNombreFlor}
                        onChange={(e) => setFinNombreFlor(e.target.value)}
                        className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-[#EAB308]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Costo Materiales */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Materiales (Limpiapipas, alambre) ($ CLP)</label>
                        <input
                          type="number"
                          value={finCostoMateriales}
                          onChange={(e) => setFinCostoMateriales(Number(e.target.value))}
                          className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#EAB308]"
                        />
                      </div>

                      {/* Costo Empaque */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Empaque & Tarjetas ($ CLP)</label>
                        <input
                          type="number"
                          value={finCostoEmpaque}
                          onChange={(e) => setFinCostoEmpaque(Number(e.target.value))}
                          className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#EAB308]"
                        />
                      </div>

                      {/* Tiempo de confección */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Tiempo Invertido (Minutos)</label>
                        <input
                          type="number"
                          value={finTiempoMinutos}
                          onChange={(e) => setFinTiempoMinutos(Number(e.target.value))}
                          className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#EAB308]"
                        />
                      </div>

                      {/* Tarifa Hora Artesano */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-white/80">Tarifa Hora Artesano ($ CLP/hr)</label>
                        <input
                          type="number"
                          value={finTarifaHora}
                          onChange={(e) => setFinTarifaHora(Number(e.target.value))}
                          className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-[#EAB308]"
                        />
                      </div>

                      {/* Margen Deseado Slider */}
                      <div className="sm:col-span-2 space-y-1.5 bg-[#2B051C] p-3 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-[#ff96c5]">Margen Deseado de Ganancia:</span>
                          <span className="text-[#EAB308] text-sm">{finMargenDeseado}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          step="5"
                          value={finMargenDeseado}
                          onChange={(e) => setFinMargenDeseado(Number(e.target.value))}
                          className="w-full accent-[#EAB308] cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-white/40 font-bold">
                          <span>10% (Bajo)</span>
                          <span>40% (Mínimo recomendado)</span>
                          <span>60% (Óptimo)</span>
                          <span>90% (Premium)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Calculated Results & JSON API Output */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Main Pricing Highlight Banner */}
                    <div className="bg-gradient-to-r from-[#42082B] via-[#2B051C] to-[#42082B] p-5 rounded-3xl border-2 border-[#EAB308] shadow-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full border border-[#EAB308]/30">
                          Precio de Venta Sugerido (Redondeado)
                        </span>

                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                          finViabilidad === 'Alta' ? 'bg-[#25D366] text-white' : finViabilidad === 'Media' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          Viabilidad: {finViabilidad}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-syne text-3xl sm:text-4xl font-black text-[#25D366]">
                          ${finPrecioSugerido.toLocaleString('es-CL')}
                        </span>
                        <span className="text-xs font-bold text-white/70">CLP</span>
                      </div>

                      <p className="text-xs text-white/80 font-bold italic">
                        {finAdvertencia}
                      </p>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-white/60">Utilidad Neta Estimada:</span>
                        <span className="font-black text-[#25D366] text-sm">${Math.round(finUtilidadNeta).toLocaleString('es-CL')} CLP</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Ganancia por Minuto:</span>
                        <span className="font-black text-[#ff96c5]">${Math.round(finGananciaPorMinuto).toLocaleString('es-CL')} CLP / min</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyFinProductToCatalog}
                        className="w-full bg-[#EAB308] hover:bg-[#facc15] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-95 transition-all mt-2"
                      >
                        <Plus className="w-4 h-4 text-black" />
                        <span>Aplicar este Precio e Crear Producto en Catálogo</span>
                      </button>
                    </div>

                    {/* Breakdown Cost Metrics Card */}
                    <div className="bg-[#42082B] p-4 rounded-2xl border border-white/20 space-y-2 text-xs">
                      <h6 className="font-syne text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#ff96c5]" />
                        <span>Desglose de Costos de Producción</span>
                      </h6>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-white/50 block text-[9px]">Materiales + Empaque:</span>
                          <span className="font-bold text-white">${(finCostoMateriales + finCostoEmpaque).toLocaleString('es-CL')} CLP</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-white/50 block text-[9px]">Mano de Obra ({finTiempoMinutos}m):</span>
                          <span className="font-bold text-white">${Math.round(finCostoLaboral).toLocaleString('es-CL')} CLP</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-white/50 block text-[9px]">Gastos Indirectos (5% Luz/Lazos):</span>
                          <span className="font-bold text-[#ff96c5]">${Math.round(finCostoOperativoExtra).toLocaleString('es-CL')} CLP</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-white/50 block text-[9px]">Costo Total Real:</span>
                          <span className="font-black text-[#25D366]">${Math.round(finCostoTotalReal).toLocaleString('es-CL')} CLP</span>
                        </div>
                      </div>
                    </div>

                    {/* JSON Format API Output View (Parseable Response) */}
                    <div className="bg-[#2B051C] p-4 rounded-2xl border border-white/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#ff96c5] flex items-center gap-1">
                          <Code className="w-3.5 h-3.5" /> Output JSON Integración PWA / Vertex AI
                        </span>
                        <span className="text-[9px] text-white/40 font-mono">application/json</span>
                      </div>
                      <pre className="bg-[#1A0D18] p-3 rounded-xl text-[10px] font-mono text-[#25D366] overflow-x-auto border border-white/10 leading-relaxed">
                        {JSON.stringify(finJsonResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOM BOUQUET EDITOR (Diseña tu Ramo - Con Editar & Eliminar) */}
            {activeTab === 'custom_bouquet' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/20 pb-4 gap-3">
                  <div>
                    <h4 className="font-syne text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-[#25D366]" />
                      <span>Diseña tu Ramo (Variedades, Colores & Precios por Tallo)</span>
                    </h4>
                    <span className="text-[10px] text-[#ff96c5] font-bold">
                      Agrega o edita las flores y precios que tus clientes pueden elegir en el Taller personalizable
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddFlowerOption}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase px-4 py-2.5 rounded-full cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Agregar Flor</span>
                  </button>
                </div>

                {/* Form to Add / Edit Flower Option */}
                <form onSubmit={handleSaveFlowerOption} className="bg-[#42082B] p-4 sm:p-5 rounded-3xl border-2 border-[#25D366]/60 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h5 className="font-syne text-sm font-black text-white">
                      {editingFlowerId ? `✏️ Editar Flor: "${flName}"` : '✨ Agregar Nueva Flor al Diseñador'}
                    </h5>
                    {editingFlowerId && (
                      <button
                        type="button"
                        onClick={handleOpenAddFlowerOption}
                        className="text-[10px] font-black text-white/70 hover:text-white bg-white/10 px-2.5 py-1 rounded-full"
                      >
                        ✕ Cancelar Edición
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Icon Emoji Selector */}
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-white/70 block mb-1">Icono / Emoji</label>
                      <select
                        value={flIcon}
                        onChange={(e) => setFlIcon(e.target.value)}
                        className="w-full bg-[#2B051C] border border-white/30 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                      >
                        {EMOJI_OPTIONS.map((emoji) => (
                          <option key={emoji} value={emoji}>
                            {emoji} {emoji}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Flower Name */}
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-bold text-white/70 block mb-1">Nombre de la Flor *</label>
                      <input
                        type="text"
                        required
                        value={flName}
                        onChange={(e) => setFlName(e.target.value)}
                        placeholder="Ej: Rosa Limpiapipa Eternos"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-[#25D366]"
                      />
                    </div>

                    {/* Color Name */}
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-white/70 block mb-1">Nombre del Color *</label>
                      <input
                        type="text"
                        required
                        value={flColorName}
                        onChange={(e) => setFlColorName(e.target.value)}
                        placeholder="Ej: Fucsia Pasión"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-[#25D366]"
                      />
                    </div>

                    {/* Price per Stem */}
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-white/70 block mb-1">Precio por Tallo ($ CLP) *</label>
                      <input
                        type="number"
                        required
                        value={flPrice}
                        onChange={(e) => setFlPrice(Number(e.target.value))}
                        placeholder="1500"
                        className="w-full bg-white/10 border border-white/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-[#25D366]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase px-8 py-3 rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg"
                    >
                      💾 {editingFlowerId ? 'Guardar Cambios en la Flor' : 'Guardar Flor en BD'}
                    </button>
                  </div>
                </form>

                {/* Custom Flowers Grid with Edit & Delete Buttons */}
                <div className="space-y-3 pt-2">
                  <h5 className="font-syne text-sm font-black text-white uppercase tracking-wider">
                    🌸 Flores Registradas en el Diseñador ({customFlowers.length})
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {customFlowers.map((fl) => (
                      <div key={fl.id} className="bg-[#42082B] p-3.5 rounded-2xl border border-white/20 flex items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-2xl shrink-0 bg-white/10 p-2 rounded-xl">{fl.iconSvg || '🌸'}</span>
                          <div className="overflow-hidden">
                            <h5 className="font-bold text-xs text-white truncate">{fl.name}</h5>
                            <span className="text-[10px] text-[#ff96c5] font-semibold block">{fl.colorName}</span>
                            <span className="text-xs font-black text-[#25D366] block">${(fl.pricePerStem || 0).toLocaleString('es-CL')} CLP / tallo</span>
                          </div>
                        </div>

                        {/* Touch Actions: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditFlowerOption(fl)}
                            className="bg-white/10 hover:bg-[#f70071] text-white text-[10px] font-black p-2 rounded-xl cursor-pointer active:scale-95 transition-all"
                            title="Editar esta flor y su precio"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFlowerOption(fl.id)}
                            className="bg-red-500/20 hover:bg-red-600 text-white text-[10px] font-black p-2 rounded-xl cursor-pointer active:scale-95 transition-all"
                            title="Eliminar flor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: TAXONOMY EDITOR (Categorías Padre ➔ Categorías Hijas) */}
            {activeTab === 'taxonomy' && (
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-3">
                  <h4 className="font-syne text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-[#f70071]" />
                    <span>Estructura de Categorías Padre e Hijas (Con Guardado Nube)</span>
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
                      const isEditingParent = editingParentId === parentCat.id;

                      return (
                        <div key={parentCat.id} className="bg-[#42082B] rounded-3xl border border-white/20 overflow-hidden shadow-lg">
                          {/* Parent Category Card Header */}
                          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => toggleExpandParentCategory(parentCat.id)}
                                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-[#ff96c5]" /> : <ChevronRight className="w-4 h-4 text-white/50" />}
                              </button>
                              <span className="text-2xl shrink-0">{parentCat.icon}</span>
                              
                              {isEditingParent ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={editingParentLabel}
                                    onChange={(e) => setEditingParentLabel(e.target.value)}
                                    className="bg-[#2B051C] border border-[#25D366] rounded-xl px-3 py-1.5 text-xs font-black text-white outline-none flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditedParentCategory(parentCat.id, editingParentLabel)}
                                    className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md cursor-pointer shrink-0"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Guardar</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setEditingParentId(null); setEditingParentLabel(''); }}
                                    className="text-xs text-white/70 hover:text-white bg-white/10 px-2 py-1.5 rounded-xl cursor-pointer shrink-0"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="overflow-hidden">
                                  <div className="flex items-center gap-2">
                                    <h6 className="font-syne text-base font-black text-white truncate">{parentCat.label}</h6>
                                    <button
                                      type="button"
                                      onClick={() => { setEditingParentId(parentCat.id); setEditingParentLabel(parentCat.label); }}
                                      className="text-white/40 hover:text-[#ff96c5] cursor-pointer"
                                      title="Editar nombre de la categoría padre"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-[#ff96c5] font-bold block">
                                    ID: {parentCat.id} • {productCount} producto{productCount !== 1 ? 's' : ''} asignado{productCount !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteParentCategory(parentCat.id)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/30 cursor-pointer shrink-0"
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
                                  <div className="flex flex-wrap gap-2.5 pt-1">
                                    {childSubcats.map((subName) => {
                                      const isEditingThisSub =
                                        editingSubcatKey?.parentId === parentCat.id &&
                                        editingSubcatKey?.oldSubName === subName;

                                      if (isEditingThisSub) {
                                        return (
                                          <div
                                            key={subName}
                                            className="flex items-center gap-1.5 bg-[#f70071]/30 border-2 border-[#25D366] rounded-2xl p-1.5 animate-dropdown"
                                          >
                                            <input
                                              type="text"
                                              value={editingSubcatText}
                                              onChange={(e) => setEditingSubcatText(e.target.value)}
                                              className="bg-[#2B051C] border border-white/40 rounded-xl px-3 py-1 text-xs font-black text-white outline-none focus:border-[#25D366]"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleSaveEditedSubcategory(parentCat.id, subName, editingSubcatText)}
                                              className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[11px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md cursor-pointer active:scale-95 transition-all"
                                              title="Guardar cambios de la subcategoría"
                                            >
                                              <Save className="w-3.5 h-3.5" />
                                              <span>Guardar</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => { setEditingSubcatKey(null); setEditingSubcatText(''); }}
                                              className="text-xs text-white/70 hover:text-white bg-white/10 px-2 py-1.5 rounded-xl cursor-pointer"
                                              title="Cancelar edición"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div
                                          key={subName}
                                          className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-bold text-white flex items-center gap-2 group hover:border-[#ff96c5] transition-all"
                                        >
                                          <span>• {subName}</span>

                                          {/* Edit Subcategory Button */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingSubcatKey({ parentId: parentCat.id, oldSubName: subName });
                                              setEditingSubcatText(subName);
                                            }}
                                            className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#f70071] text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                                            title={`Editar subcategoría "${subName}"`}
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </button>

                                          {/* Delete Subcategory Button */}
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteSubcategory(parentCat.id, subName)}
                                            className="w-5 h-5 rounded-full bg-red-500/30 hover:bg-red-500 text-white flex items-center justify-center text-[10px] font-black cursor-pointer transition-colors"
                                            title={`Eliminar subcategoría "${subName}"`}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      );
                                    })}
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

            {/* TAB: EDIT SLIDERS (3 BANNERS) */}
            {activeTab === 'sliders' && (
              <div className="space-y-6 text-left animate-dropdown">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
                  <div>
                    <h4 className="font-syne text-xl font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#ff96c5]" />
                      <span>Gestor de Sliders / Banners Principales ({sliders.length})</span>
                    </h4>
                    <p className="text-xs text-white/80 font-bold">
                      Edita el título, descripción, insignia y la imagen de cada uno de los 3 sliders interactivos de la historia principal.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSliders}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>💾 Guardar los 3 Sliders en la Nube</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {sliders.map((sl, idx) => (
                    <div key={sl.id || idx} className="bg-[#42082B] p-5 sm:p-6 rounded-3xl border-2 border-white/20 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-[#ff96c5]">
                          🖼️ Slider #0{idx + 1}
                        </span>
                        <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-white/80 font-bold">
                          Banner #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        {/* Image Preview & Upload Left */}
                        <div className="md:col-span-4 space-y-3">
                          <label className="text-xs font-extrabold text-white block">
                            Imagen del Slider #{idx + 1} *
                          </label>
                          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-white/30 bg-black/40 shadow-inner group">
                            <img
                              src={sl.image || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800'}
                              alt={`Slider ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              value={sl.image}
                              onChange={(e) => handleSliderChange(idx, 'image', e.target.value)}
                              placeholder="URL de la imagen (o sube archivo abajo)..."
                              className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#f70071]"
                            />

                            <label className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-3 rounded-xl border border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-all">
                              <Camera className="w-4 h-4 text-[#ff96c5]" />
                              <span>Subir Foto del Celular / Galería</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    compressImage(file, (compressedUrl) => {
                                      handleSliderChange(idx, 'image', compressedUrl);
                                      alert(`¡Foto cargada para el Slider #${idx + 1}!`);
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Inputs Right */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-white">Insignia / Badge Superior</label>
                              <input
                                type="text"
                                value={sl.badge}
                                onChange={(e) => handleSliderChange(idx, 'badge', e.target.value)}
                                placeholder="Ej: MANIFIESTO ARTESANAL"
                                className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold text-white">Título Principal del Slider</label>
                              <input
                                type="text"
                                value={sl.title}
                                onChange={(e) => handleSliderChange(idx, 'title', e.target.value)}
                                placeholder="Ej: Esculturas Vivas Creadas para Perdurar"
                                className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#f70071]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-white">Descripción Larga del Banner</label>
                            <textarea
                              rows={3}
                              value={sl.desc}
                              onChange={(e) => handleSliderChange(idx, 'desc', e.target.value)}
                              placeholder="Escribe la descripción detallada del banner..."
                              className="w-full bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[#f70071]"
                            />
                          </div>

                          {/* Highlights Bullet List */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#ff96c5] uppercase tracking-wider block">
                              Puntos Destacados (Lista de Beneficios)
                            </label>
                            {(sl.highlights || ['', '', '']).map((hl, hlIdx) => (
                              <div key={hlIdx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                                <input
                                  type="text"
                                  value={hl}
                                  onChange={(e) => handleSliderHighlightChange(idx, hlIdx, e.target.value)}
                                  placeholder={`Beneficio #${hlIdx + 1}...`}
                                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none focus:border-[#25D366]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveSliders}
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-5 h-5" />
                    <span>💾 Guardar los 3 Sliders y Sincronizar en la Nube Supabase</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
