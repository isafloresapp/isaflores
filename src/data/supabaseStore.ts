// supabaseStore.ts — Capa de datos IsaFlores conectada a Supabase
// Reemplaza adminStore.ts (localStorage) con persistencia en la nube.
// ================================================================
import { supabase } from '../lib/supabase';
import type {
  AdminProduct, AdminOrder, AdminCustomer, SiteContent,
  OrderItem, OrderStatus, DocumentType,
} from './adminStore';

// ─── Re-export tipos para que los componentes solo importen de aquí ──
export type { AdminProduct, AdminOrder, AdminCustomer, SiteContent, OrderItem, OrderStatus, DocumentType };

// ─── Transformadores DB (snake_case) ↔ App (camelCase) ─────────────

const toProduct = (row: any): AdminProduct => ({
  id: row.id, name: row.name, category: row.category, price: row.price,
  description: row.description || '', fullDetails: row.full_details, badge: row.badge,
  image: row.image || '', bgTint: row.bg_tint || '#FFF', flowerCount: row.flower_count,
  tags: row.tags || [], rating: row.rating || 4.5, reviewsCount: row.reviews_count || 0,
  stock: row.stock || 0, minStock: row.min_stock || 3,
  stockNotes: row.stock_notes, artisanNote: row.artisan_note, isActive: row.is_active ?? true,
  seoTitle: row.seo_title, seoDescription: row.seo_description, seoKeywords: row.seo_keywords,
  createdAt: row.created_at, updatedAt: row.updated_at,
});

const fromProduct = (p: Partial<AdminProduct>) => ({
  id: p.id, name: p.name, category: p.category, price: p.price,
  description: p.description, full_details: p.fullDetails, badge: p.badge,
  image: p.image, bg_tint: p.bgTint, flower_count: p.flowerCount,
  tags: p.tags, rating: p.rating, reviews_count: p.reviewsCount,
  stock: p.stock, min_stock: p.minStock, stock_notes: p.stockNotes,
  artisan_note: p.artisanNote, is_active: p.isActive,
  seo_title: p.seoTitle, seo_description: p.seoDescription, seo_keywords: p.seoKeywords,
});

const toOrder = (row: any, items: OrderItem[] = []): AdminOrder => ({
  id: row.id, orderNumber: row.order_number, date: row.date,
  customerId: row.customer_id, customerName: row.customer_name,
  customerPhone: row.customer_phone, customerEmail: row.customer_email,
  customerAddress: row.customer_address, items, type: row.type,
  status: row.status, total: row.total, internalNotes: row.internal_notes,
  trackingNumber: row.tracking_number, documentType: row.document_type,
  customDetails: row.custom_details, createdAt: row.created_at, updatedAt: row.updated_at,
});

const toCustomer = (row: any): AdminCustomer => ({
  id: row.id, name: row.name, phone: row.phone, email: row.email,
  address: row.address, city: row.city, region: row.region, notes: row.notes,
  orderIds: [], totalSpent: row.total_spent || 0,
  createdAt: row.created_at, updatedAt: row.updated_at,
});

// ─── Autenticación (se mantiene igual: client-side) ────────────────
export const ADMIN_CREDENTIALS = { user: 'isaflores2026', password: 'Isabel25111988' };
export const authStore = {
  login: (user: string, password: string): boolean => {
    if (user === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isaflores_admin_auth', 'authenticated');
      return true;
    }
    return false;
  },
  logout: () => localStorage.removeItem('isaflores_admin_auth'),
  isAuthenticated: (): boolean => localStorage.getItem('isaflores_admin_auth') === 'authenticated',
};

// ─── Store de Productos ────────────────────────────────────────────
export const productStore = {
  getAll: async (): Promise<AdminProduct[]> => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) { console.error('productStore.getAll:', error); return []; }
    return (data || []).map(toProduct);
  },
  getActive: async (): Promise<AdminProduct[]> => {
    const { data, error } = await supabase.from('products').select('*').eq('is_active', true);
    if (error) { console.error('productStore.getActive:', error); return []; }
    return (data || []).map(toProduct);
  },
  add: async (product: AdminProduct): Promise<void> => {
    const { error } = await supabase.from('products').insert(fromProduct(product));
    if (error) console.error('productStore.add:', error);
  },
  update: async (id: string, updates: Partial<AdminProduct>): Promise<void> => {
    const { error } = await supabase.from('products').update(fromProduct(updates)).eq('id', id);
    if (error) console.error('productStore.update:', error);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error('productStore.delete:', error);
  },
};

// ─── Store de Pedidos ──────────────────────────────────────────────
let _orderCounter = 0;
const generateOrderNumber = async (): Promise<string> => {
  const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  return `ISA-${String((count || 0) + 1).padStart(4, '0')}`;
};

export const orderStore = {
  getAll: async (): Promise<AdminOrder[]> => {
    const { data: ordersData, error } = await supabase
      .from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (error) { console.error('orderStore.getAll:', error); return []; }
    return (ordersData || []).map(row => {
      const items: OrderItem[] = (row.order_items || []).map((i: any) => ({
        productId: i.product_id, productName: i.product_name,
        quantity: i.quantity, unitPrice: i.unit_price, subtotal: i.subtotal,
      }));
      return toOrder(row, items);
    });
  },

  add: async (order: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<AdminOrder> => {
    const orderNumber = await generateOrderNumber();
    const id = `order-${Date.now()}`;
    const now = new Date().toISOString();
    const newOrderRow = {
      id, order_number: orderNumber, date: order.date || new Date().toLocaleString('es-CL'),
      customer_id: order.customerId, customer_name: order.customerName,
      customer_phone: order.customerPhone, customer_email: order.customerEmail,
      customer_address: order.customerAddress, type: order.type, status: order.status,
      total: order.total, internal_notes: order.internalNotes,
      tracking_number: order.trackingNumber, document_type: order.documentType || 'orden',
      custom_details: order.customDetails,
    };
    const { error: orderErr } = await supabase.from('orders').insert(newOrderRow);
    if (orderErr) { console.error('orderStore.add (order):', orderErr); }
    if (order.items && order.items.length > 0) {
      const itemRows = order.items.map(item => ({
        order_id: id, product_id: item.productId, product_name: item.productName,
        quantity: item.quantity, unit_price: item.unitPrice, subtotal: item.subtotal,
      }));
      const { error: itemsErr } = await supabase.from('order_items').insert(itemRows);
      if (itemsErr) console.error('orderStore.add (items):', itemsErr);
    }
    return { ...order, id, orderNumber, createdAt: now, updatedAt: now, documentType: order.documentType || 'orden' };
  },

  update: async (id: string, updates: Partial<AdminOrder>): Promise<void> => {
    const row: any = {};
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.internalNotes !== undefined) row.internal_notes = updates.internalNotes;
    if (updates.trackingNumber !== undefined) row.tracking_number = updates.trackingNumber;
    if (updates.documentType !== undefined) row.document_type = updates.documentType;
    if (updates.customerId !== undefined) row.customer_id = updates.customerId;
    const { error } = await supabase.from('orders').update(row).eq('id', id);
    if (error) console.error('orderStore.update:', error);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) console.error('orderStore.delete:', error);
  },

  getMonthlyRevenue: async (): Promise<number> => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data } = await supabase.from('orders').select('total').neq('status', 'cancelado').gte('created_at', start);
    return (data || []).reduce((sum, o) => sum + (o.total || 0), 0);
  },

  getTotalRevenue: async (): Promise<number> => {
    const { data } = await supabase.from('orders').select('total').neq('status', 'cancelado');
    return (data || []).reduce((sum, o) => sum + (o.total || 0), 0);
  },
};

// ─── Store de Clientes ──────────────────────────────────────────────
export const customerStore = {
  getAll: async (): Promise<AdminCustomer[]> => {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) { console.error('customerStore.getAll:', error); return []; }
    // Enriquecer con order IDs
    const customers = (data || []).map(toCustomer);
    const { data: ordersData } = await supabase.from('orders').select('id, customer_id');
    if (ordersData) {
      customers.forEach(c => {
        c.orderIds = ordersData.filter(o => o.customer_id === c.id).map(o => o.id);
      });
    }
    return customers;
  },

  add: async (customer: Omit<AdminCustomer, 'id' | 'createdAt' | 'updatedAt' | 'orderIds' | 'totalSpent'>): Promise<AdminCustomer> => {
    const id = `cust-${Date.now()}`;
    const { data, error } = await supabase.from('customers').insert({
      id, name: customer.name, phone: customer.phone, email: customer.email,
      address: customer.address, city: customer.city, region: customer.region,
      notes: customer.notes, total_spent: 0,
    }).select().single();
    if (error) { console.error('customerStore.add:', error); }
    return toCustomer(data || { id, ...customer, total_spent: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  },

  update: async (id: string, updates: Partial<AdminCustomer>): Promise<void> => {
    const row: any = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.phone !== undefined) row.phone = updates.phone;
    if (updates.email !== undefined) row.email = updates.email;
    if (updates.address !== undefined) row.address = updates.address;
    if (updates.city !== undefined) row.city = updates.city;
    if (updates.region !== undefined) row.region = updates.region;
    if (updates.notes !== undefined) row.notes = updates.notes;
    if (updates.totalSpent !== undefined) row.total_spent = updates.totalSpent;
    const { error } = await supabase.from('customers').update(row).eq('id', id);
    if (error) console.error('customerStore.update:', error);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) console.error('customerStore.delete:', error);
  },

  findByPhone: async (phone: string): Promise<AdminCustomer | undefined> => {
    const normalized = phone.replace(/\\s/g, '');
    const { data } = await supabase.from('customers').select('*');
    const found = (data || []).find(c => c.phone?.replace(/\\s/g, '') === normalized);
    return found ? toCustomer(found) : undefined;
  },

  upsertFromOrder: async (orderData: { name: string; phone: string; email?: string; address?: string }, orderId: string, total: number): Promise<string> => {
    const existing = await customerStore.findByPhone(orderData.phone);
    if (existing) {
      await customerStore.update(existing.id, { totalSpent: existing.totalSpent + total });
      return existing.id;
    } else {
      const newCustomer = await customerStore.add({ name: orderData.name, phone: orderData.phone, email: orderData.email, address: orderData.address });
      await customerStore.update(newCustomer.id, { totalSpent: total });
      return newCustomer.id;
    }
  },
};

// ─── Store de Contenido ────────────────────────────────────────────
const DEFAULT_CONTENT: SiteContent = {
  heroTitle: 'Flores hechas a mano. Recuerdos para siempre.',
  heroSubtitle: 'Creamos increíbles arreglos florales con limpiapipas que nunca se marchitan.',
  heroSlogan: 'Flores que perduran',
  heroVideoUrl: '',
  announcementBar: '🌸 Envíos de Alta Seguridad a Todo Chile · Flores Hechas a Mano con Amor',
  pillar1Title: 'Hecho a Mano', pillar1Text: 'Damos forma a cada pétalo con limpiapipas de alta calidad.',
  pillar2Title: 'Duran para Siempre', pillar2Text: 'Tu regalo no se marchitar� jam�s.',
  pillar3Title: 'Envíos Seguros a Todo Chile', pillar3Text: 'Recibe tu pedido impecable en cualquier parte de Chile.',
  pillar4Title: 'Atención Personalizada', pillar4Text: 'Hablamos por WhatsApp para entender exactamente lo que necesitas.',
  footerDescription: 'Flores hechas a mano con amor que nunca se marchitan.',
  footerPhone: '+56 9 2870 4768', footerHours: 'Lunes a Sábado, 09:00 a 19:00 hrs',
  footerAddress: 'Paseo Los Manzanos 6721, La Florida, Regi�n Metropolitana', footerShipping: 'Starken / Chilexpress',
};

export const contentStore = {
  get: async (): Promise<SiteContent> => {
    const { data, error } = await supabase.from('site_content').select('key, value');
    if (error || !data) return DEFAULT_CONTENT;
    const map: Record<string, string> = {};
    data.forEach(row => { map[row.key] = row.value; });
    return { ...DEFAULT_CONTENT, ...map } as SiteContent;
  },
  update: async (updates: Partial<SiteContent>): Promise<void> => {
    const upserts = Object.entries(updates).map(([key, value]) => ({ key, value: String(value) }));
    if (upserts.length === 0) return;
    const { error } = await supabase.from('site_content').upsert(upserts, { onConflict: 'key' });
    if (error) console.error('contentStore.update:', error);
  },
};

// ─── Auto-guardar pedido desde WhatsApp ────────────────────────────
export const autoSaveOrder = async (params: {
  customerName: string; customerPhone: string;
  items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; subtotal: number }>;
  total: number; customDetails?: string; type: AdminOrder['type'];
}): Promise<void> => {
  try {
    const newOrder = await orderStore.add({
      customerName: params.customerName, customerPhone: params.customerPhone,
      items: params.items, total: params.total, type: params.type,
      status: 'nuevo', documentType: 'orden', customDetails: params.customDetails,
      date: new Date().toLocaleString('es-CL'),
    });
    await customerStore.upsertFromOrder(
      { name: params.customerName, phone: params.customerPhone },
      newOrder.id, params.total
    );
      // Descontar stock de cada producto comprado
      for (const item of params.items) {
        const { data: prod } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();
        if (prod) {
          const newStock = Math.max(0, (prod.stock || 0) - item.quantity);
          await supabase.from('products').update({ stock: newStock }).eq('id', item.productId);
        }
      }
  } catch (e) {
    console.error('autoSaveOrder:', e);
  }
};

// ─── Sugerencias de IA (listas para conectar a Gemini API) ─────────
export const generateAITextSuggestions = (sectionType: string, _currentText: string): string[] => {
  const suggestions: Record<string, string[]> = {
    heroTitle: ['Flores hechas a mano. Recuerdos para siempre. Duran para siempre.', 'Flores únicas que nunca se marchitan.', 'El regalo perfecto que perdura en el tiempo.', 'Arte floral hecho a mano, pétalo a pétalo.'],
    heroSubtitle: ['Creamos increíbles arreglos florales con limpiapipas que nunca se marchitan. El regalo perfecto.', 'Flores de limpiapipas hechas a mano con amor. Regalos eternos que enviamos a todo Chile.', 'Cada flor es única, moldeada a mano especialmente para ti. Descubre nuestros arreglos eternos.', 'Transforma un momento especial en un recuerdo eterno con nuestras flores artesanales.'],
    footerDescription: ['Flores hechas a mano con amor que nunca se marchitan. El regalo perfecto de Santiago de Chile.', 'Arreglos florales artesanales de limpiapipas. Diseñados con amor, enviados con cuidado a todo Chile.', 'Tu floristería de flores eternas. Cada pieza es única, hecha a mano con cariño.', 'Creamos flores de limpiapipas que duran para siempre. Perfectas para regalar y decorar.'],
    default: ['Edita este texto con tu propuesta.', 'Escribe aquí tu mensaje para los clientes.', 'Agrega un texto cercano, amigable y directo.', 'Muestra tu personalidad de marca en cada palabra.'],
  };
  return suggestions[sectionType] || suggestions.default;
};


// ?????? Builder Manager Store ????????????????????????????????????????????????????????
import { CUSTOM_FLOWER_OPTIONS } from './products';
import type { CustomFlowerOption } from '../types';

export const builderStore = {
  getFlowers: async (): Promise<CustomFlowerOption[]> => {
    const { data } = await supabase.from('site_content').select('value').eq('key', 'builder_flowers').single();
    if (data?.value) return JSON.parse(data.value);
    return CUSTOM_FLOWER_OPTIONS;
  },
  saveFlowers: async (flowers: CustomFlowerOption[]): Promise<void> => {
    await supabase.from('site_content').upsert({ key: 'builder_flowers', value: JSON.stringify(flowers) });
  }
};



\n