// Product Data
const products = [
  {
    id: 1,
    name: 'Organic Strawberries',
    emoji: '🍓',
    price: 4.99,
    category: 'berries',
    weight: '250g',
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Fresh Mangoes',
    emoji: '🥭',
    price: 6.49,
    category: 'tropical',
    weight: '2pcs',
    rating: 4.8,
    reviews: 96,
  },
  {
    id: 3,
    name: 'Sweet Bananas',
    emoji: '🍌',
    price: 2.99,
    category: 'tropical',
    weight: '1 bunch',
    rating: 4.7,
    reviews: 215,
  },
  {
    id: 4,
    name: 'Red Apples',
    emoji: '🍎',
    price: 3.99,
    category: 'stone',
    weight: '500g',
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 5,
    name: 'Blueberries',
    emoji: '🫐',
    price: 5.49,
    category: 'berries',
    weight: '170g',
    rating: 4.9,
    reviews: 142,
  },
  {
    id: 6,
    name: 'Fresh Oranges',
    emoji: '🍊',
    price: 4.49,
    category: 'citrus',
    weight: '1kg',
    rating: 4.6,
    reviews: 167,
  },
  {
    id: 7,
    name: 'Purple Grapes',
    emoji: '🍇',
    price: 5.99,
    category: 'berries',
    weight: '500g',
    rating: 4.8,
    reviews: 134,
  },
  {
    id: 8,
    name: 'Watermelon',
    emoji: '🍉',
    price: 7.99,
    category: 'tropical',
    weight: '1 whole',
    rating: 4.7,
    reviews: 201,
  },
  {
    id: 9,
    name: 'Sweet Peaches',
    emoji: '🍑',
    price: 5.49,
    category: 'stone',
    weight: '500g',
    rating: 4.9,
    reviews: 88,
  },
  {
    id: 10,
    name: 'Lemons',
    emoji: '🍋',
    price: 3.49,
    category: 'citrus',
    weight: '500g',
    rating: 4.5,
    reviews: 112,
  },
  {
    id: 11,
    name: 'Fresh Cherries',
    emoji: '🍒',
    price: 6.99,
    category: 'stone',
    weight: '250g',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 12,
    name: 'Pineapple',
    emoji: '🍍',
    price: 4.99,
    category: 'tropical',
    weight: '1 whole',
    rating: 4.6,
    reviews: 178,
  },
]

// State
let cart = []
let currentCategory = 'all'
let searchQuery = ''

// DOM Elements
const productsGrid = document.getElementById('productsGrid')
const cartSidebar = document.getElementById('cartSidebar')
const cartItems = document.getElementById('cartItems')
const cartBadge = document.getElementById('cartBadge')
const overlay = document.getElementById('overlay')
const toast = document.getElementById('toast')
const toastMsg = document.getElementById('toastMsg')

// Render Products
function renderProducts() {
  const filtered = products.filter((p) => {
    const matchCategory = currentCategory === 'all' || p.category === currentCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  productsGrid.innerHTML = filtered
    .map(
      (p, i) => `
                <div class="fruit-card bg-white rounded-2xl shadow-md overflow-hidden group" style="animation: slideUp 0.5s ease ${i * 0.05}s forwards; opacity: 0;">
                    <div class="relative p-6 pb-2 bg-gradient-to-br from-gray-50 to-white">
                        <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-600">${p.weight}</div>
                        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            ⭐ ${p.rating}
                        </div>
                        <div class="fruit-img text-center py-4">
                            <span class="text-7xl md:text-8xl block">${p.emoji}</span>
                        </div>
                    </div>
                    <div class="p-4 pt-2">
                        <h3 class="font-semibold text-gray-800 mb-1">${p.name}</h3>
                        <p class="text-xs text-gray-400 mb-3">${p.reviews} reviews</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold text-emerald-600">$${p.price.toFixed(2)}</span>
                            <button onclick="addToCart(${p.id})" class="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition shadow-md hover:shadow-lg pulse-green">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `
    )
    .join('')
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existing = cart.find((item) => item.id === productId)

  if (existing) {
    existing.quantity++
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCart()
  showToast(`${product.name} added to cart!`)
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCart()
}

function updateQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId)
  if (item) {
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(productId)
      return
    }
  }
  updateCart()
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 4.99
  const total = subtotal + shipping

  // Update badge
  if (totalItems > 0) {
    cartBadge.textContent = totalItems
    cartBadge.classList.remove('hidden')
  } else {
    cartBadge.classList.add('hidden')
  }

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg class="w-20 h-20 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
                        <p class="font-medium">Your cart is empty</p>
                        <p class="text-sm mt-1">Add some delicious fruits!</p>
                    </div>
                `
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
                    <div class="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                        <span class="text-3xl">${item.emoji}</span>
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-800 text-sm">${item.name}</h4>
                            <p class="text-emerald-600 font-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-600 hover:text-emerald-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                            </button>
                            <span class="w-6 text-center font-medium text-sm">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-600 hover:text-emerald-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            </button>
                        </div>
                        <button onclick="removeFromCart(${item.id})" class="p-1 text-gray-400 hover:text-red-500 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                `
      )
      .join('')
  }

  // Update totals
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`
  document.getElementById('shipping').textContent =
    shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`
  document.getElementById('total').textContent = `$${total.toFixed(2)}`
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`

  document.getElementById('checkoutBtn').disabled = cart.length === 0
}

// Toast
function showToast(message) {
  toastMsg.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 2000)
}

// Event Listeners
document.getElementById('cartBtn').addEventListener('click', () => {
  cartSidebar.classList.add('open')
  overlay.classList.add('show')
})

function closeCart() {
  cartSidebar.classList.remove('open')
  overlay.classList.remove('show')
}

document.getElementById('closeCart').addEventListener('click', closeCart)
overlay.addEventListener('click', () => {
  closeCart()
  closeCheckout()
})

// Category Filters
document.querySelectorAll('.category-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach((b) => {
      b.classList.remove('active')
      b.classList.add('bg-gray-100', 'text-gray-600')
    })
    btn.classList.add('active')
    btn.classList.remove('bg-gray-100', 'text-gray-600')
    currentCategory = btn.dataset.category
    renderProducts()
  })
})

// Search
document.getElementById('searchToggle').addEventListener('click', () => {
  document.getElementById('searchBar').classList.toggle('hidden')
  document.getElementById('searchInput').focus()
})

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value
  renderProducts()
})

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
  closeCart()
  document.getElementById('checkoutModal').style.pointerEvents = 'auto'
  document.getElementById('checkoutModal').querySelector('.checkout-modal').classList.add('show')
})

function closeCheckout() {
  document.getElementById('checkoutModal').style.pointerEvents = 'none'
  document.getElementById('checkoutModal').querySelector('.checkout-modal').classList.remove('show')
}

document.getElementById('closeCheckout').addEventListener('click', closeCheckout)

// Checkout Form
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault()
  closeCheckout()
  cart = []
  updateCart()
  document.getElementById('successModal').style.pointerEvents = 'auto'
  document.getElementById('successModal').querySelector('.checkout-modal').classList.add('show')
})

document.getElementById('closeSuccess').addEventListener('click', () => {
  document.getElementById('successModal').style.pointerEvents = 'none'
  document.getElementById('successModal').querySelector('.checkout-modal').classList.remove('show')
})

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault()
  showToast('Message sent successfully!')
  e.target.reset()
})

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})

// Init
renderProducts()
updateCart()
