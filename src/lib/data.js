import { existsSync } from 'node:fs';
import path from 'node:path';
import dishes from '../../data/dishes.json';
import users from '../../data/users.json';
import seedOrders from '../../data/orders.json';

const globalStore = globalThis;

if (!globalStore.__ADDIS_EATS_ORDERS__) {
  globalStore.__ADDIS_EATS_ORDERS__ = seedOrders;
}
if (!globalStore.__ADDIS_EATS_USERS__) {
  globalStore.__ADDIS_EATS_USERS__ = users;
}
if (!globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__) {
  globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__ = new Map();
}
if (!globalStore.__ADDIS_EATS_DISH_AVAILABILITY__) {
  globalStore.__ADDIS_EATS_DISH_AVAILABILITY__ = new Map();
}

const fallbackImages = {
  'doro-wat': '/images/dishes/doro-wat.svg',
  'beef-tibs': '/images/dishes/tibs.svg',
  'kikil': '/images/dishes/tibs.svg',
  'gomen-besiga': '/images/dishes/tibs.svg',
  'shiro-wat': '/images/dishes/paneer.svg',
  'misir-wat': '/images/dishes/paneer.svg',
  'atkilt': '/images/dishes/paneer.svg',
  'fosolia': '/images/dishes/paneer.svg',
  'beyaynetu': '/images/dishes/paneer.svg',
  'classic-beef-burger': '/images/dishes/burger.svg',
  'special-burger': '/images/dishes/burger.svg',
  'margherita-pizza': '/images/dishes/margherita.svg',
  'pepperoni-pizza': '/images/dishes/margherita.svg',
  'buna': '/images/dishes/coffee.svg',
  'ethiopian-macchiato': '/images/dishes/coffee.svg',
  'shai': '/images/dishes/coffee.svg',
  'fresh-juice': '/images/dishes/juice.svg',
  'sparkling-water': '/images/dishes/juice.svg',
  'fruit-plate': '/images/dishes/fruit.svg'
};

function imageForDish(dish) {
  const relative = String(dish.image || '').replace(/^\/+/, '');
  const suppliedImage = path.join(process.cwd(), 'public', relative);
  if (relative && existsSync(suppliedImage)) return `/${relative}`;
  return fallbackImages[dish.id] || '/images/dishes/doro-wat.svg';
}

export function getDishes() {
  return dishes.map((dish) => ({
    ...dish,
    image: imageForDish(dish),
    isAvailable: globalStore.__ADDIS_EATS_DISH_AVAILABILITY__.has(dish.id)
      ? globalStore.__ADDIS_EATS_DISH_AVAILABILITY__.get(dish.id)
      : dish.isAvailable !== false
  }));
}

export function getDish(id) {
  return getDishes().find((dish) => dish.id === id) ?? null;
}

export function setDishAvailability(dishId, isAvailable) {
  if (!dishes.some((dish) => dish.id === dishId) || typeof isAvailable !== 'boolean') return null;
  // Demo store only: a persistent production database must save this field.
  globalStore.__ADDIS_EATS_DISH_AVAILABILITY__.set(dishId, isAvailable);
  return getDish(dishId);
}

export function searchDishes(query = '') {
  const normalized = query.trim().toLowerCase();
  const catalog = getDishes();
  if (!normalized) return catalog;
  return catalog.filter((dish) =>
    [dish.name, dish.category, dish.description].join(' ').toLowerCase().includes(normalized)
  );
}

const SEEDED_DEMO_USER_IDS = new Set(['user-1', 'user-2', 'staff-1']);

function demoAccountsEnabled() {
  const configured = process.env.ENABLE_DEMO_ACCOUNTS?.trim().toLowerCase();
  if (configured === 'true') return true;
  if (configured === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

export function getUserByEmail(email) {
  const user = globalStore.__ADDIS_EATS_USERS__.find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
  // Known seeded credentials are for local/preview demonstrations only. They
  // must not grant staff access on the public production deployment by default.
  if (user && SEEDED_DEMO_USER_IDS.has(user.id) && !demoAccountsEnabled()) return null;
  return user;
}

export function getUserById(id) {
  return globalStore.__ADDIS_EATS_USERS__.find((user) => user.id === id) ?? null;
}

export function createUser({ name, email, passwordHash }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (globalStore.__ADDIS_EATS_USERS__.some((user) => user.email.toLowerCase() === normalizedEmail)) return null;
  const user = { id: `user_${crypto.randomUUID()}`, name: name.trim(), email: normalizedEmail, passwordHash, role: 'customer' };
  globalStore.__ADDIS_EATS_USERS__.push(user);
  return user;
}

export function getOrdersFor(userId) {
  return globalStore.__ADDIS_EATS_ORDERS__
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOrderForUser(orderId, userId) {
  return globalStore.__ADDIS_EATS_ORDERS__.find(
    (order) => order.id === orderId && order.userId === userId
  ) ?? null;
}

export function getAllOrders() {
  return [...globalStore.__ADDIS_EATS_ORDERS__].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function createOrder({ userId, customerName, phone, area, deliveryAddress = '', items, deliveryOption = 'standard', deliveryFee = 60, idempotencyKey = '' }) {
  // Process-local idempotency guard for the demo runtime. Production must use a
  // unique database constraint on (userId, idempotencyKey) to cover instances.
  const key = typeof idempotencyKey === 'string' ? idempotencyKey.trim() : '';
  const dedupeKey = key ? `${userId}:${key}` : '';
  const seenOrderId = dedupeKey ? globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__.get(dedupeKey) : null;
  if (seenOrderId) {
    const existingOrder = globalStore.__ADDIS_EATS_ORDERS__.find((entry) => entry.id === seenOrderId);
    if (existingOrder) return existingOrder;
    globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__.delete(dedupeKey);
  }
  const now = new Date().toISOString();
  const order = {
    id: `ord_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    customerName,
    phone,
    area,
    deliveryAddress: String(deliveryAddress || '').trim(),
    deliveryOption,
    deliveryFee,
    status: 'received',
    createdAt: now,
    updatedAt: now,
    items
  };

  globalStore.__ADDIS_EATS_ORDERS__.unshift(order);
  if (dedupeKey) {
    globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__.set(dedupeKey, order.id);
    // Bound the in-memory map for long-running local demos.
    while (globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__.size > 1000) {
      const oldestKey = globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__.keys().next().value;
      if (!oldestKey) break;
      globalStore.__ADDIS_EATS_ORDER_IDEMPOTENCY__.delete(oldestKey);
    }
  }
  return order;
}

export function updateOrderStatus(orderId, status) {
  const order = globalStore.__ADDIS_EATS_ORDERS__.find((entry) => entry.id === orderId);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}
