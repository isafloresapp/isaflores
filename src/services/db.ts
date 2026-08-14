import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

export interface DbOrder {
  id: string;
  customerName: string;
  phone: string;
  addressComuna: string;
  productName: string;
  total: number;
  isExpress: boolean;
  deliveryDate: string;
  status: 'pendiente' | 'en_preparacion' | 'despachado' | 'cancelado';
  notes?: string;
  createdAt: string;
}

export interface CustomFlowerOption {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  pricePerStem: number;
  iconSvg: string;
}

export interface TaxonomyConfig {
  categories: { id: string; label: string; icon: string }[];
  subcategoriesMap: Record<string, string[]>;
}

const DB_PRODUCTS_KEY = 'isaflores_db_products_v6';
const DB_ORDERS_KEY = 'isaflores_db_orders_v6';
const DB_CUSTOM_FLOWERS_KEY = 'isaflores_db_custom_flowers_v6';
const DB_TAXONOMY_KEY = 'isaflores_db_taxonomy_v6';

const INITIAL_CUSTOM_FLOWERS: CustomFlowerOption[] = [
  { id: 'girasol', name: 'Girasol Silvestre', colorName: 'Amarillo Girasol', colorHex: '#EAB308', pricePerStem: 1800, iconSvg: '🌻' },
  { id: 'tulipan', name: 'Tulipán Holandés', colorName: 'Rosa Pastel', colorHex: '#ff96c5', pricePerStem: 1500, iconSvg: '🌷' },
  { id: 'rosa', name: 'Rosa de Autor', colorName: 'Fucsia Magenta', colorHex: '#f70071', pricePerStem: 2200, iconSvg: '🌹' },
  { id: 'lavanda', name: 'Flor de Lavanda', colorName: 'Púrpura Silvestre', colorHex: '#A855F7', pricePerStem: 1200, iconSvg: '🪻' },
  { id: 'margarita', name: 'Margarita Silvestre', colorName: 'Blanco Puro', colorHex: '#FFFFFF', pricePerStem: 1300, iconSvg: '🌼' },
];

class DatabaseService {
  // 100% PERSISTENT PRODUCTS SYNC (BI-DIRECTIONAL SUPABASE CLOUD + LOCALSTORAGE)
  async getProducts(): Promise<Product[]> {
    let localProducts: Product[] = [];
    try {
      const stored = localStorage.getItem(DB_PRODUCTS_KEY);
      if (stored) {
        localProducts = JSON.parse(stored);
      }
    } catch (e) {}

    if (!localProducts || localProducts.length === 0) {
      localProducts = INITIAL_PRODUCTS;
    }

    try {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data) {
          // Filter out system rows
          const realData = data.filter((p) => !String(p.id).startsWith('SYS_'));

          const cloudProducts: Product[] = realData.map((p) => ({
            id: String(p.id),
            name: p.name || 'Flor IsaFlores',
            price: Number(p.price) || 14990,
            category: p.category || 'ramos',
            categoryLabel: p.category === 'ramos' ? 'Ramos Eternos' : p.category === 'girasoles' ? 'Girasoles' : 'Flores',
            subcategory: (p as any).subcategory || 'General',
            description: p.description || '',
            fullDetails: p.description || '',
            badge: p.badge || 'Destacado',
            image: p.image || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
            images: [p.image || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800'],
            bgTint: '#FDF0F5',
            rating: Number(p.rating) || 5.0,
            reviewsCount: 15,
            tags: [p.category || 'flores', 'flores eternas']
          }));

          // Cloud products ALWAYS take priority! If cloud has custom items, use them.
          // If cloud has 0 non-system items, reset to initial catalog!
          const finalList = cloudProducts.length > 0 ? cloudProducts : INITIAL_PRODUCTS;

          this.saveProductsLocal(finalList);
          return finalList;
        }
      }
    } catch (e) {
      console.warn('Supabase cloud fetch products note:', e);
    }

    return localProducts;
  }

  private saveProductsLocal(products: Product[]): void {
    try {
      localStorage.setItem(DB_PRODUCTS_KEY, JSON.stringify(products));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('isaflores_catalog_changed', { detail: products }));
      }
    } catch (e) {
      console.warn('LocalStorage quota warning, saving lightweight fallback:', e);
      try {
        const lightweight = products.map((p) => ({
          ...p,
          image: p.image.length > 300000 ? 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800' : p.image
        }));
        localStorage.setItem(DB_PRODUCTS_KEY, JSON.stringify(lightweight));
      } catch (e2) {}
    }
  }

  async saveProductCloud(product: Product): Promise<void> {
    try {
      if (supabase) {
        let safeImage = product.image || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';
        if (safeImage.length > 2500000) {
          safeImage = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800';
        }

        const payload = {
          id: String(product.id),
          name: String(product.name || 'Nuevo Producto'),
          price: Number(product.price) || 0,
          category: String(product.category || 'ramos'),
          description: String(product.description || ''),
          badge: String(product.badge || 'Nuevo'),
          image: safeImage,
          rating: Number(product.rating) || 5.0
        };

        const { error } = await supabase.from('products').upsert(payload);
        if (error) {
          console.error('Supabase Product Upsert Error:', error.message);
        }
      }
    } catch (e) {
      console.warn('Error saving product to Supabase cloud:', e);
    }
  }

  async addProduct(product: Product): Promise<Product[]> {
    let current: Product[] = [];
    try {
      const stored = localStorage.getItem(DB_PRODUCTS_KEY);
      current = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch (e) {
      current = INITIAL_PRODUCTS;
    }

    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    this.saveProductsLocal(updated);
    await this.saveProductCloud(product);
    return updated;
  }

  async updateProduct(product: Product): Promise<Product[]> {
    let current: Product[] = [];
    try {
      const stored = localStorage.getItem(DB_PRODUCTS_KEY);
      current = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch (e) {
      current = INITIAL_PRODUCTS;
    }

    const updated = current.map((p) => (p.id === product.id ? product : p));
    this.saveProductsLocal(updated);
    await this.saveProductCloud(product);
    return updated;
  }

  async deleteProduct(productId: string): Promise<Product[]> {
    try {
      if (supabase) {
        await supabase.from('products').delete().eq('id', productId);
      }
    } catch (e) {}

    let current: Product[] = [];
    try {
      const stored = localStorage.getItem(DB_PRODUCTS_KEY);
      current = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch (e) {
      current = INITIAL_PRODUCTS;
    }

    const updated = current.filter((p) => p.id !== productId);
    this.saveProductsLocal(updated);
    return updated;
  }

  async clearAllTestProducts(): Promise<Product[]> {
    try {
      if (supabase) {
        const { data } = await supabase.from('products').select('id');
        if (data) {
          const testIds = data.map((p) => String(p.id)).filter((id) => !id.startsWith('SYS_'));
          for (const id of testIds) {
            await supabase.from('products').delete().eq('id', id);
          }
        }
      }
    } catch (e) {}

    this.saveProductsLocal(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  // 2. ORDERS MANAGEMENT PERSISTENCE
  async getOrders(): Promise<DbOrder[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const cloudOrders: DbOrder[] = data.map((o) => ({
            id: String(o.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`),
            customerName: o.customer_name || 'Cliente',
            phone: o.phone || '',
            addressComuna: o.address_comuna || '',
            productName: o.product_name || 'Ramo de Flores',
            total: Number(o.total) || 0,
            isExpress: Boolean(o.is_express),
            deliveryDate: o.delivery_date || '',
            status: o.status || 'pendiente',
            notes: o.notes || '',
            createdAt: o.created_at || new Date().toISOString()
          }));

          localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(cloudOrders));
          return cloudOrders;
        }
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem(DB_ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  async addOrder(orderData: Omit<DbOrder, 'id' | 'createdAt'>): Promise<DbOrder[]> {
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: DbOrder = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    try {
      if (supabase) {
        await supabase.from('orders').insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          phone: newOrder.phone,
          address_comuna: newOrder.addressComuna,
          product_name: newOrder.productName,
          total: newOrder.total,
          is_express: newOrder.isExpress,
          delivery_date: newOrder.deliveryDate,
          status: newOrder.status,
          notes: newOrder.notes
        });
      }
    } catch (e) {}

    const current = await this.getOrders();
    const updated = [newOrder, ...current];
    localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(updated));
    return updated;
  }

  async updateOrderStatus(orderId: string, status: DbOrder['status']): Promise<DbOrder[]> {
    try {
      if (supabase) {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      }
    } catch (e) {}

    const current = await this.getOrders();
    const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(updated));
    return updated;
  }

  // 3. SYSTEM CONFIGS CLOUD PERSISTENCE (Custom Flowers & Taxonomies)
  async getCustomFlowers(): Promise<CustomFlowerOption[]> {
    try {
      if (supabase) {
        const { data } = await supabase.from('products').select('*').eq('id', 'SYS_CUSTOM_FLOWERS').single();
        if (data && data.description) {
          const parsed = JSON.parse(data.description);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.setItem(DB_CUSTOM_FLOWERS_KEY, JSON.stringify(parsed));
            return parsed;
          }
        }
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem(DB_CUSTOM_FLOWERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_CUSTOM_FLOWERS;
    } catch (e) {
      return INITIAL_CUSTOM_FLOWERS;
    }
  }

  async saveCustomFlowers(flowers: CustomFlowerOption[]): Promise<void> {
    localStorage.setItem(DB_CUSTOM_FLOWERS_KEY, JSON.stringify(flowers));
    try {
      if (supabase) {
        await supabase.from('products').upsert({
          id: 'SYS_CUSTOM_FLOWERS',
          name: 'System Config - Custom Flowers',
          price: 0,
          category: 'system',
          description: JSON.stringify(flowers),
          image: 'system',
          rating: 5
        });
      }
    } catch (e) {}
  }

  async getTaxonomies(): Promise<TaxonomyConfig | null> {
    try {
      if (supabase) {
        const { data } = await supabase.from('products').select('*').eq('id', 'SYS_TAXONOMY').single();
        if (data && data.description) {
          const parsed = JSON.parse(data.description);
          if (parsed && parsed.categories) {
            localStorage.setItem(DB_TAXONOMY_KEY, JSON.stringify(parsed));
            return parsed;
          }
        }
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem(DB_TAXONOMY_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  async saveTaxonomies(config: TaxonomyConfig): Promise<void> {
    localStorage.setItem(DB_TAXONOMY_KEY, JSON.stringify(config));
    try {
      if (supabase) {
        await supabase.from('products').upsert({
          id: 'SYS_TAXONOMY',
          name: 'System Config - Taxonomy Hierarchy',
          price: 0,
          category: 'system',
          description: JSON.stringify(config),
          image: 'system',
          rating: 5
        });
      }
    } catch (e) {}
  }
}

export const db = new DatabaseService();
