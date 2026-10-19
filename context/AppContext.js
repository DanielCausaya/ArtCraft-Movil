import React, { createContext, useContext, useState } from 'react';
import { products as seedProducts, categories as seedCategories } from '../data/mock';

const AppContext = createContext();

// Usuarios de ejemplo (el admin entra con cualquier correo que empiece por "admin")
const seedUsers = [
  { id: 'u1', name: 'Admin ArtCraft', email: 'admin@artcraft.com', role: 'admin', active: true },
  { id: 'u2', name: 'muselen10', email: 'muselen10@gmail.com', role: 'cliente', active: true },
  { id: 'u3', name: 'Camila Torres', email: 'camila@correo.com', role: 'cliente', active: true },
  { id: 'u4', name: 'Luis Pérez', email: 'luis@correo.com', role: 'cliente', active: false },
];

// Pedidos de ejemplo para que el panel tenga datos
const seedOrders = [
  {
    id: '#1001', date: '12/10/2026', customer: 'Camila Torres',
    items: [{ product: seedProducts[0], qty: 2 }],
    total: 230000, status: 'En camino',
  },
  {
    id: '#1002', date: '14/10/2026', customer: 'Luis Pérez',
    items: [{ product: seedProducts[2], qty: 1 }, { product: seedProducts[1], qty: 1 }],
    total: 140000, status: 'Entregado',
  },
  {
    id: '#1003', date: '16/10/2026', customer: 'Ana Gómez',
    items: [{ product: seedProducts[5], qty: 1 }],
    total: 110000, status: 'Cancelado',
  },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(seedUsers);
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);
  const [cart, setCart] = useState([]); // {product, qty}
  const [favorites, setFavorites] = useState([]); // product ids
  const [orders, setOrders] = useState(seedOrders);
  const [addresses, setAddresses] = useState(['Calle 123 #123-45, Popayán']);
  const [cards, setCards] = useState(['Visa terminada en 1234']);
  const [notifications, setNotifications] = useState({ pedidos: true, promos: true, noticias: false });

  const updateProfile = (name, email) => {
    if (!name || !email) return { ok: false, error: 'Nombre y correo son obligatorios' };
    const oldEmail = user?.email;
    setUser((u) => ({ ...(u || {}), name, email }));
    setUsers((prev) => prev.map((u) => (u.email === oldEmail ? { ...u, name, email } : u)));
    return { ok: true };
  };

  const addAddress = (text) => text && setAddresses((prev) => [...prev, text]);
  const addCard = (text) => text && setCards((prev) => [...prev, text]);
  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  // Simulación de autenticación con roles
  const login = (email, password) => {
    if (!email || !password) return { ok: false, error: 'Completa todos los campos' };
    const key = email.trim().toLowerCase();
    const known = users.find((u) => u.email.toLowerCase() === key);
    if (known && !known.active) return { ok: false, error: 'Esta cuenta está desactivada' };
    const role = known ? known.role : key.startsWith('admin') ? 'admin' : 'cliente';
    setUser({ name: known ? known.name : email.split('@')[0], email: known ? known.email : email, role });
    return { ok: true, role };
  };

  const register = (name, email, password, confirm) => {
    if (!name || !email || !password) return { ok: false, error: 'Completa todos los campos' };
    if (password !== confirm) return { ok: false, error: 'Las contraseñas no coinciden' };
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      return { ok: false, error: 'Este correo ya está registrado' };
    setUsers((prev) => [...prev, { id: 'u' + Date.now(), name, email, role: 'cliente', active: true }]);
    setUser({ name, email, role: 'cliente' });
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const checkout = () => {
    if (cart.length === 0) return null;
    const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0) + 30000;
    const order = {
      id: '#' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('es-CO'),
      customer: user?.name || 'Cliente',
      items: cart,
      total,
      status: 'En camino',
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  // ===== Administración: Productos =====
  const addProduct = (data) =>
    setProducts((prev) => [
      { id: String(Date.now()), rating: 4, images: [data.image], ...data },
      ...prev,
    ]);

  const updateProduct = (id, data) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, images: [data.image] } : p))
    );

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setFavorites((prev) => prev.filter((f) => f !== id));
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  // ===== Administración: Categorías =====
  const addCategory = (name, image) =>
    setCategories((prev) => [{ id: String(Date.now()), name, image }, ...prev]);

  const updateCategory = (id, name, image) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name, image } : c)));

  const deleteCategory = (id, reassignTo) => {
    const target = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (target && reassignTo) {
      setProducts((prev) =>
        prev.map((p) => (p.category === target.name ? { ...p, category: reassignTo } : p))
      );
    }
  };

  // ===== Administración: Pedidos =====
  const updateOrderStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  // ===== Administración: Usuarios =====
  const toggleUserActive = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target || target.email === user?.email)
      return { ok: false, error: 'No puedes desactivar tu propia cuenta' };
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    return { ok: true };
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <AppContext.Provider
      value={{
        user, login, register, logout, updateProfile,
        users, toggleUserActive,
        products, addProduct, updateProduct, deleteProduct,
        categories, addCategory, updateCategory, deleteCategory,
        cart, addToCart, changeQty, cartTotal,
        favorites, toggleFavorite,
        orders, checkout, updateOrderStatus,
        addresses, addAddress, cards, addCard,
        notifications, toggleNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
