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

const DB_PRODUCTS_KEY = 'isaflores_db_products_v3';
const DB_ORDERS_KEY = 'isaflores_db_orders_v3';
const DB_CUSTOM_FLOWERS_KEY = 'isaflores_db_custom_flowers_v3';

const INITIAL_CUSTOM_FLOWERS: CustomFlowerOption[] = [
  { id: 'girasol', name: 'Girasol Silvestre', colorName: 'Amarillo Girasol', colorHex: '#EAB308', pricePerStem: 1800, iconSvg: '🌻' },
  { id: 'tulipan', name: 'Tulipán Holandés', colorName: 'Rosa Pastel', colorHex: '#ff96c5', pricePerStem: 1500, iconSvg: '🌷' },
  { id: 'rosa', name: 'Rosa de Autor', colorName: 'Fucsia Magenta', colorHex: '#f70071', pricePerStem: 2200, iconSvg: '🌹' },
  { id: 'lavanda', name: 'Flor de Lavanda', colorName: 'Púrpura Silvestre', colorHex: '#A855F7', pricePerStem: 1200, iconSvg: '🪻' },
  { id: 'margarita', name: 'Margarita Silvestre', colorName: 'Blanco Puro', colorHex: '#FFFFFF', pricePerStem: 1300, iconSvg: '🌼' },
];

class DatabaseService {
  // 100% DIRECT BI-DIRECTIONAL SUPABASE CLOUD PRODUCTS SYNC
  async getProducts(): Promise<Product[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          const formattedProducts: Product[] = data.map((p) => ({
            id: p.id,
            name: p.name || 'Flor IsaFlores',
            price: Number(p.price) || 14990,
            category: p.category || 'ramos',
            categoryLabel: p.category === 'ramos' ? 'Ramos Eternos' : p.category === 'girasoles' ? 'Girasoles' : 'Flores',
            subcategory: 'General',
            description: p.description || '',
            fullDetails: p.description || '',
            badge: p.badge || 'Destacado',
            image: p.image || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800',
            images: [p.image],
            bgTint: '#FDF0F5',
            rating: Number(p.rating) || 5.0,
            reviewsCount: 15,
            tags: [p.category, 'flores eternas']
          }));

          this.saveProductsLocal(formattedProducts);
          return formattedProducts;
        }
      }
    } catch (e) {
      console.warn('Supabase cloud fetch products note:', e);
    }

    try {
      const stored = localStorage.getItem(DB_PRODUCTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    this.saveProductsLocal(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  private saveProductsLocal(products: Product[]): void {
    try {
      localStorage.setItem(DB_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {}
  }

  async saveProductCloud(product: Product): Promise<void> {
    try {
      if (supabase) {
        const payload = {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          badge: product.badge || 'Nuevo',
          image: product.image,
          rating: product.rating || 5.0
        };
        await supabase.from('products').upsert(payload);
      }
    } catch (e) {
      console.warn('Error saving product to Supabase cloud:', e);
    }
  }

  async addProduct(product: Product): Promise<Product[]> {
    await this.saveProductCloud(product);
    const products = await this.getProducts();
    const updated = [product, ...products.filter(p => p.id !== product.id)];
    this.saveProductsLocal(updated);
    return updated;
  }

  async updateProduct(product: Product): Promise<Product[]> {
    await this.saveProductCloud(product);
    const products = await this.getProducts();
    const updated = products.map((p) => (p.id === product.id ? product : p));
    this.saveProductsLocal(updated);
    return updated;
  }

  async deleteProduct(productId: string): Promise<Product[]> {
    try {
      if (supabase) {
        await supabase.from('products').delete().eq('id', productId);
      }
    } catch (e) {}

    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== productId);
    this.saveProductsLocal(updated);
    return updated;
  }

  // 100% DIRECT BI-DIRECTIONAL SUPABASE CLOUD ORDERS SYNC
  async getOrders(): Promise<DbOrder[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          const formattedOrders: DbOrder[] = data.map((o) => ({
            id: o.id,
            customerName: o.customerName || 'Cliente',
            phone: o.phone || '',
            addressComuna: o.addressComuna || 'La Florida',
            productName: o.productName || 'Flores IsaFlores',
            total: Number(o.total) || 0,
            isExpress: Boolean(o.isExpress),
            deliveryDate: o.deliveryDate || new Date().toISOString(),
            status: o.status || 'pendiente',
            notes: o.notes || '',
            createdAt: o.createdAt || new Date().toISOString()
          }));
          this.saveOrdersLocal(formattedOrders);
          return formattedOrders;
        }
      }
    } catch (e) {
      console.warn('Supabase cloud fetch orders note:', e);
    }

    try {
      const stored = localStorage.getItem(DB_ORDERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    return [];
  }

  private saveOrdersLocal(orders: DbOrder[]): void {
    try {
      localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {}
  }

  async saveOrderCloud(order: DbOrder): Promise<void> {
    try {
      if (supabase) {
        await supabase.from('orders').upsert(order);
      }
    } catch (e) {
      console.warn('Error saving order to Supabase cloud:', e);
    }
  }

  async addOrder(orderData: Omit<DbOrder, 'id' | 'createdAt'>): Promise<DbOrder[]> {
    const newOrder: DbOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    await this.saveOrderCloud(newOrder);
    const orders = await this.getOrders();
    const updated = [newOrder, ...orders.filter(o => o.id !== newOrder.id)];
    this.saveOrdersLocal(updated);
    return updated;
  }

  async updateOrderStatus(orderId: string, status: DbOrder['status']): Promise<DbOrder[]> {
    const orders = await this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      const updatedOrder = { ...target, status };
      await this.saveOrderCloud(updatedOrder);
    }
    const updatedList = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    this.saveOrdersLocal(updatedList);
    return updatedList;
  }

  async updateOrder(order: DbOrder): Promise<DbOrder[]> {
    await this.saveOrderCloud(order);
    const orders = await this.getOrders();
    const updated = orders.map((o) => (o.id === order.id ? order : o));
    this.saveOrdersLocal(updated);
    return updated;
  }

  // CUSTOM BOUQUET FLOWER OPTIONS
  async getCustomFlowers(): Promise<CustomFlowerOption[]> {
    try {
      const stored = localStorage.getItem(DB_CUSTOM_FLOWERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveCustomFlowers(INITIAL_CUSTOM_FLOWERS);
    return INITIAL_CUSTOM_FLOWERS;
  }

  async saveCustomFlowers(flowers: CustomFlowerOption[]): Promise<boolean> {
    try {
      localStorage.setItem(DB_CUSTOM_FLOWERS_KEY, JSON.stringify(flowers));
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const db = new DatabaseService();
