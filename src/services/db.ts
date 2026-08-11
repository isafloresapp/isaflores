import { Product, CartItem } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

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

const DB_PRODUCTS_KEY = 'isaflores_db_products_v2';
const DB_ORDERS_KEY = 'isaflores_db_orders_v2';
const DB_CUSTOM_FLOWERS_KEY = 'isaflores_db_custom_flowers_v2';

const INITIAL_CUSTOM_FLOWERS: CustomFlowerOption[] = [
  { id: 'girasol', name: 'Girasol Silvestre', colorName: 'Amarillo Girasol', colorHex: '#EAB308', pricePerStem: 1800, iconSvg: '🌻' },
  { id: 'tulipan', name: 'Tulipán Holandés', colorName: 'Rosa Pastel', colorHex: '#ff96c5', pricePerStem: 1500, iconSvg: '🌷' },
  { id: 'rosa', name: 'Rosa de Autor', colorName: 'Fucsia Magenta', colorHex: '#f70071', pricePerStem: 2200, iconSvg: '🌹' },
  { id: 'lavanda', name: 'Flor de Lavanda', colorName: 'Púrpura Silvestre', colorHex: '#A855F7', pricePerStem: 1200, iconSvg: '🪻' },
  { id: 'margarita', name: 'Margarita Silvestre', colorName: 'Blanco Puro', colorHex: '#FFFFFF', pricePerStem: 1300, iconSvg: '🌼' },
];

const INITIAL_ORDERS: DbOrder[] = [
  {
    id: 'ORD-1001',
    customerName: 'María José Pérez',
    phone: '+56 9 1234 5678',
    addressComuna: 'Av. Providencia 1234, Providencia',
    productName: 'Ramo Coral Perenne (x1)',
    total: 14990,
    isExpress: false,
    deliveryDate: '2026-08-14',
    status: 'en_preparacion',
    notes: 'Incluir dedicatoria "Feliz Aniversario"',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-1002',
    customerName: 'Camila Rojas V.',
    phone: '+56 9 8765 4321',
    addressComuna: 'Vicuña Mackenna 7890, La Florida',
    productName: 'Colección Girasoles Silvestres (x2)',
    total: 19980,
    isExpress: true,
    deliveryDate: '2026-08-11',
    status: 'pendiente',
    notes: 'Despacho prioritario tarde',
    createdAt: new Date().toISOString(),
  },
];

class DatabaseService {
  // PRODUCTS OPERATIONS
  async getProducts(): Promise<Product[]> {
    try {
      const stored = localStorage.getItem(DB_PRODUCTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error fetching products:', e);
    }
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  async saveProducts(products: Product[]): Promise<boolean> {
    try {
      localStorage.setItem(DB_PRODUCTS_KEY, JSON.stringify(products));
      return true;
    } catch (e) {
      return false;
    }
  }

  async addProduct(product: Product): Promise<Product[]> {
    const products = await this.getProducts();
    const updated = [product, ...products];
    await this.saveProducts(updated);
    return updated;
  }

  async updateProduct(product: Product): Promise<Product[]> {
    const products = await this.getProducts();
    const updated = products.map((p) => (p.id === product.id ? product : p));
    await this.saveProducts(updated);
    return updated;
  }

  async deleteProduct(productId: string): Promise<Product[]> {
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== productId);
    await this.saveProducts(updated);
    return updated;
  }

  // ORDERS OPERATIONS
  async getOrders(): Promise<DbOrder[]> {
    try {
      const stored = localStorage.getItem(DB_ORDERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error fetching orders:', e);
    }
    this.saveOrders(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  }

  async saveOrders(orders: DbOrder[]): Promise<boolean> {
    try {
      localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(orders));
      return true;
    } catch (e) {
      return false;
    }
  }

  async addOrder(orderData: Omit<DbOrder, 'id' | 'createdAt'>): Promise<DbOrder[]> {
    const orders = await this.getOrders();
    const newOrder: DbOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    await this.saveOrders(updated);
    return updated;
  }

  async updateOrderStatus(orderId: string, status: DbOrder['status']): Promise<DbOrder[]> {
    const orders = await this.getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    await this.saveOrders(updated);
    return updated;
  }

  async updateOrder(order: DbOrder): Promise<DbOrder[]> {
    const orders = await this.getOrders();
    const updated = orders.map((o) => (o.id === order.id ? order : o));
    await this.saveOrders(updated);
    return updated;
  }

  // CUSTOM BOUQUET FLOWER OPTIONS OPERATIONS
  async getCustomFlowers(): Promise<CustomFlowerOption[]> {
    try {
      const stored = localStorage.getItem(DB_CUSTOM_FLOWERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error fetching custom flowers:', e);
    }
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
