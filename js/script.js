// DOM Elements
const header = document.getElementById('header');
const mobileBtn = document.getElementById('mobile-btn');
const navLinks = document.getElementById('nav-links');

// Cart Elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCounter = document.getElementById('cart-counter');
const cartTotalPrice = document.getElementById('cart-total-price');
const emptyCartBtn = document.getElementById('empty-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// Cart State Array
let cart = [];

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if(navLinks.classList.contains('active')) {
        mobileBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// CART LOGIC
// -------------

// Toggle Cart Sidebar
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
};

cartIcon.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Add to Cart
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        updateCartUI();
        
        // Button animation feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        button.classList.add('added');
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('added');
        }, 1500);
    });
});

// Remove from Cart
const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

// Change Quantity
const changeQuantity = (id, delta) => {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
};

// Empty Cart
emptyCartBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            cart = [];
            updateCartUI();
        }
    }
});

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos para continuar.');
    } else {
        alert('¡Gracias por tu compra! Te redirigiremos a la pasarela de pago.');
        cart = [];
        updateCartUI();
        toggleCart();
    }
});

// Update UI
const updateCartUI = () => {
    // Update Counter
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.innerText = totalItems;

    // Update Items Container
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío</div>';
        cartTotalPrice.innerText = '$0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.classList.add('cart-item');
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    // Update Total Price
    cartTotalPrice.innerText = `$${total.toFixed(2)}`;
};

// Expose functions to global scope for inline onclick handlers
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;


// FORM VALIDATION
// ---------------
const orderForm = document.getElementById('order-form');
const formMsg = document.getElementById('form-msg');

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple client-side validation
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const product = document.getElementById('product').value;
        const quantity = document.getElementById('quantity').value;

        if (!name || !phone || !product || !quantity) {
            formMsg.textContent = 'Por favor, completa todos los campos.';
            formMsg.className = 'form-msg error';
            return;
        }

        // Simulate sending data
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            orderForm.reset();
            formMsg.textContent = '¡Pedido realizado con éxito! Nos contactaremos pronto.';
            formMsg.className = 'form-msg success';
            
            setTimeout(() => {
                formMsg.textContent = '';
                formMsg.className = 'form-msg';
            }, 5000);
        }, 1500);
    });
}

// SCROLL ANIMATIONS (Intersection Observer)
// -----------------------------------------
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.slide-up, .slide-in-left, .slide-in-right, .fade-in');
    animatedElements.forEach(el => observer.observe(el));
    
    // Trigger hero animation immediately on load
    const heroContent = document.querySelector('.hero-content.fade-in');
    if(heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 100);
    }
});
