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
  return dishes.map((dish) => ({ ...dish, image: imageForDish(dish) }));
}

export function getDish(id) {
  return getDishes().find((dish) => dish.id === id) ?? null;
}

export function searchDishes(query = '') {
  const normalized = query.trim().toLowerCase();
  const catalog = getDishes();
  if (!normalized) return catalog;
  return catalog.filter((dish) =>
    [dish.name, dish.category, dish.description].join(' ').toLowerCase().includes(normalized)
  );
}

export function getUserByEmail(email) {
  return globalStore.__ADDIS_EATS_USERS__.find((user) => user.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
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

export function createOrder({ userId, customerName, phone, area, items, deliveryOption = 'standard', deliveryFee = 60 }) {
  const order = {
    id: `ord_${crypto.randomUUID().slice(0, 8)}`,
    userId,
    customerName,
    phone,
    area,
    deliveryOption,
    deliveryFee,
    status: 'received',
    createdAt: new Date().toISOString(),
    items
  };

  globalStore.__ADDIS_EATS_ORDERS__.unshift(order);
  return order;
}

export function updateOrderStatus(orderId, status) {
  const order = globalStore.__ADDIS_EATS_ORDERS__.find((entry) => entry.id === orderId);
  if (!order) return null;
  order.status = status;
  return order;
}
