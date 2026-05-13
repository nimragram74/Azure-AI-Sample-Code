// ============================================
// SHOPEASE – APPLICATION LOGIC
// ============================================

// --- Auth Users Store (simulated) ---
const USERS_KEY = 'shopease_users';
const SESSION_KEY = 'shopease_session';

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  const users = raw ? JSON.parse(raw) : [];
  // Ensure demo account always exists
  if (!users.find(u => u.email === 'demo@shopease.com')) {
    users.push({ email: 'demo@shopease.com', password: 'demo1234', firstName: 'Demo', lastName: 'User' });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ============================================
// AUTH PAGE LOGIC
// ============================================

function switchTab(tab) {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab     = document.getElementById('loginTab');
  const registerTab  = document.getElementById('registerTab');
  if (!loginForm) return;

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');

  errEl.classList.add('hidden');

  const users = getUsers();
  const user  = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errEl.textContent = 'Invalid email or password. Please try again.';
    errEl.classList.remove('hidden');
    return;
  }

  setSession(user);
  window.location.href = 'shop.html';
}

function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('regEmail').value.trim().toLowerCase();
  const password  = document.getElementById('regPassword').value;
  const confirm   = document.getElementById('confirmPassword').value;
  const errEl     = document.getElementById('registerError');
  const successEl = document.getElementById('registerSuccess');

  errEl.classList.add('hidden');
  successEl.classList.add('hidden');

  if (password !== confirm) {
    errEl.textContent = 'Passwords do not match.';
    errEl.classList.remove('hidden');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    errEl.textContent = 'An account with this email already exists.';
    errEl.classList.remove('hidden');
    return;
  }

  users.push({ email, password, firstName, lastName });
  saveUsers(users);

  successEl.textContent = `Account created! Welcome, ${firstName}. Signing you in...`;
  successEl.classList.remove('hidden');

  setTimeout(() => {
    setSession({ email, firstName, lastName });
    window.location.href = 'shop.html';
  }, 1500);
}

function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// ============================================
// PRODUCT DATA
// ============================================

const PRODUCTS = [
  { id: 1,  name: 'Wireless Headphones',    category: 'electronics', emoji: '🎧', price: 79.99,  original: 129.99, rating: 4.8, reviews: 1240, desc: 'Premium sound quality with 30hr battery.', badge: 'sale' },
  { id: 2,  name: 'Smart Watch Pro',         category: 'electronics', emoji: '⌚', price: 199.99, original: 249.99, rating: 4.6, reviews: 856,  desc: 'Health tracking, GPS, waterproof.', badge: 'hot' },
  { id: 3,  name: 'Mechanical Keyboard',     category: 'electronics', emoji: '⌨️', price: 89.99,  original: null,   rating: 4.7, reviews: 632,  desc: 'Tactile RGB switches, full size.', badge: null },
  { id: 4,  name: '4K Webcam',              category: 'electronics', emoji: '📷', price: 129.99, original: 179.99, rating: 4.5, reviews: 421,  desc: 'Crystal clear video calls, auto focus.', badge: 'sale' },
  { id: 5,  name: 'Running Sneakers',        category: 'sports',      emoji: '👟', price: 64.99,  original: 99.99,  rating: 4.9, reviews: 2130, desc: 'Lightweight foam sole for comfort.', badge: 'hot' },
  { id: 6,  name: 'Yoga Mat Premium',        category: 'sports',      emoji: '🧘', price: 34.99,  original: null,   rating: 4.7, reviews: 789,  desc: 'Non-slip surface, eco-friendly.', badge: 'new' },
  { id: 7,  name: 'Protein Shaker Bottle',   category: 'sports',      emoji: '🥤', price: 19.99,  original: null,   rating: 4.4, reviews: 1560, desc: 'Leak-proof, BPA-free, 24oz.', badge: null },
  { id: 8,  name: 'Denim Jacket',            category: 'fashion',     emoji: '🧥', price: 49.99,  original: 79.99,  rating: 4.6, reviews: 913,  desc: 'Classic fit, premium denim.', badge: 'sale' },
  { id: 9,  name: 'Leather Handbag',         category: 'fashion',     emoji: '👜', price: 89.99,  original: 140.00, rating: 4.8, reviews: 674,  desc: 'Genuine leather, multiple compartments.', badge: null },
  { id: 10, name: 'Summer Dress',            category: 'fashion',     emoji: '👗', price: 39.99,  original: null,   rating: 4.5, reviews: 388,  desc: 'Floral print, breathable fabric.', badge: 'new' },
  { id: 11, name: 'Sunglasses UV400',        category: 'fashion',     emoji: '🕶️', price: 29.99,  original: 59.99,  rating: 4.3, reviews: 1120, desc: 'Full UV protection, polarised.', badge: 'sale' },
  { id: 12, name: 'Scented Candle Set',      category: 'home',        emoji: '🕯️', price: 24.99,  original: null,   rating: 4.9, reviews: 2340, desc: 'Set of 3, natural soy wax.', badge: 'hot' },
  { id: 13, name: 'Coffee Maker',            category: 'home',        emoji: '☕', price: 59.99,  original: 89.99,  rating: 4.7, reviews: 1087, desc: '12-cup capacity, programmable.', badge: 'sale' },
  { id: 14, name: 'Throw Blanket',           category: 'home',        emoji: '🛋️', price: 44.99,  original: null,   rating: 4.8, reviews: 743,  desc: 'Ultra-soft fleece, 50"x60".', badge: 'new' },
  { id: 15, name: 'Minimalist Wall Clock',   category: 'home',        emoji: '🕐', price: 32.99,  original: null,   rating: 4.4, reviews: 287,  desc: 'Silent movement, 12-inch diameter.', badge: null },
  { id: 16, name: 'JavaScript: The Good Parts', category: 'books',   emoji: '📗', price: 18.99,  original: null,   rating: 4.8, reviews: 5670, desc: 'Essential reading for web developers.', badge: null },
  { id: 17, name: 'Atomic Habits',           category: 'books',       emoji: '📘', price: 14.99,  original: 24.99,  rating: 4.9, reviews: 9240, desc: 'Transform your habits, transform your life.', badge: 'hot' },
  { id: 18, name: 'Clean Code',              category: 'books',       emoji: '📙', price: 22.99,  original: null,   rating: 4.7, reviews: 4210, desc: 'A handbook of agile software craftsmanship.', badge: null },
];

// ============================================
// SHOP PAGE LOGIC
// ============================================

let cart = [];
let activeCategory = 'all';
let activeSearch = '';
let activeSortOrder = 'default';

function initShopPage() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('userGreeting').textContent = `Hello, ${session.firstName || session.email.split('@')[0]} 👋`;
  loadCart();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
                        p.desc.toLowerCase().includes(activeSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  if (activeSortOrder === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (activeSortOrder === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (activeSortOrder === 'rating')     filtered.sort((a, b) => b.rating - a.rating);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${p.badge ? `<div class="product-badge ${p.badge}">${p.badge.toUpperCase()}</div>` : ''}
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-stars">
          ${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}
          <span>${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-footer">
          <div class="price-group">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            ${p.original ? `<span class="product-original">$${p.original.toFixed(2)}</span>` : ''}
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id})" title="Add to cart">+</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function filterCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function filterProducts() {
  activeSearch = document.getElementById('searchInput').value;
  renderProducts();
}

function sortProducts(val) {
  activeSortOrder = val;
  renderProducts();
}

// ============================================
// CART LOGIC
// ============================================

const CART_KEY = 'shopease_cart';

function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  cart = raw ? JSON.parse(raw) : [];
  updateCartUI();
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.emoji} "${product.name}" added to cart!`);
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = count;

  renderCartItems();
}

function renderCartItems() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter  = document.getElementById('cartFooter');
  const cartTotal   = document.getElementById('cartTotal');
  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Your cart is empty 🛒</div>';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  if (cartFooter) cartFooter.style.display = 'block';

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">✕ Remove</button>
        </div>
      </div>
    </div>`).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
}

function checkout() {
  showToast('🎉 Order placed successfully! Thank you for shopping with ShopEase.');
  cart = [];
  saveCart();
  updateCartUI();
  toggleCart();
}

// ============================================
// UTILITIES
// ============================================

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

function logout() {
  clearSession();
  cart = [];
  localStorage.removeItem(CART_KEY);
  window.location.href = 'index.html';
}

// ============================================
// BOOTSTRAP – run correct page logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.shop-page')) {
    initShopPage();
  }
  // On auth page, redirect if already logged in
  if (document.querySelector('.auth-page')) {
    if (getSession()) window.location.href = 'shop.html';
  }
});
