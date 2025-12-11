/* IA#2: Event Handling - Mobile Menu Toggle */
/* Purpose: To open and close the mobile navigation menu on click. */
/* Creator: Tiffany Maragh 1705946 */

const menuToggleButton = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-nav-menu');

function toggleMobileMenu() {
    if (!menuToggleButton || !mobileMenu) return;

    // Toggle visual state
    const opening = !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', opening);

    // Update icon and aria label
    const icon = menuToggleButton.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars', !opening);
        icon.classList.toggle('fa-xmark', opening);
    }
    menuToggleButton.setAttribute('aria-label', opening ? 'Close Menu' : 'Open Menu');
}

if (menuToggleButton) {
    menuToggleButton.addEventListener('click', toggleMobileMenu);
}

/* IA#2: User Authentication - Login Function */
/* Purpose: Handle user login with TRN authentication for invoice system */
/* Modified by: Jamarie McGlashen (2408376) - Added TRN support for invoices */
/* updated by: Tiffany Maragh 1705946 - Fixed authentication logic */
function handleLogin(event) {
    event.preventDefault();

    // 1. Get input values
    const trnInput = document.getElementById('login-trn')?.value.trim();
    const passwordInput = document.getElementById('login-password').value;
    
    // 2. Setup (must be at the top)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    let loginAttempts = parseInt(sessionStorage.getItem('loginAttempts')) || 0;
    const MAX_ATTEMPTS = 3; 
    
    // --- DEBUG CHECK ---
    //console.log("LOGIN DEBUG: TRN:", trnInput, "Password:", passwordInput); 

    // --- 1. CHECK LOCKOUT STATUS ---
    if (loginAttempts >= MAX_ATTEMPTS) {
        alert("Account locked. You have exceeded the maximum login attempts.");
        window.location.href = 'error-account-locked.html';
        return;
    }

    // --- 2. ADMIN LOGIN ---
    if (trnInput === '999-999-999' && passwordInput === 'Admin123!') {
        sessionStorage.removeItem('loginAttempts'); 
        localStorage.setItem('currentUser', 'Administrator');
        localStorage.setItem('currentUserTRN', '999-999-999');
        localStorage.setItem('isAdmin', 'true');
        updateHeaderWelcomeMessage();
        alert('Admin Login Successful! Welcome Administrator');
        window.location.href = 'Admin_dash.html'; 
        return;
    }

    // --- 3. USER AUTHENTICATION (The correct two-step search) ---
    // STEP A: Find the user object based ONLY on the unique TRN.
    const user = registeredUsers.find(u => u.trn === trnInput); 

    // STEP B: Check if user was found AND the password matches
    if (user && user.password === passwordInput) { 
        // --- SUCCESS ---
        sessionStorage.removeItem('loginAttempts'); 

        // Store user data
        localStorage.setItem('currentUser', `${user.firstName} ${user.lastName}`);
        localStorage.setItem('currentUserTRN', user.trn);
        localStorage.setItem('isAdmin', 'false');
        
        updateHeaderWelcomeMessage();
        alert('Login Successful! Welcome ' + user.firstName);
        window.location.href = '../index.html'; 
        return; 
    } else {
        // --- FAILURE PATH ---
        loginAttempts++;
        sessionStorage.setItem('loginAttempts', loginAttempts);

        const remaining = MAX_ATTEMPTS - loginAttempts;

        if (remaining > 0) {
            alert(`Login Failed: Incorrect TRN or password. ${remaining} attempts remaining.`);
        } else {
            alert("Login Failed. Maximum attempts exceeded. Account locked.");
            window.location.href = 'error-account-locked.html';
        }
        
        const pwdEl = document.getElementById('login-password');
        if (pwdEl) pwdEl.value = '';
    }
}

/* Helper function to check login status and update ALL pages */
function updateHeaderWelcomeMessage(username = null) {
    const welcomeHeader = document.getElementById('welcome-message-header');
    const userAuthDiv = document.querySelector('.user-auth');

    // If no username provided, check localStorage
    if (!username) {
        username = localStorage.getItem('currentUser');
    }

    if (username && welcomeHeader) {
        welcomeHeader.textContent = `Welcome Back, ${username}!`;
        welcomeHeader.style.display = 'inline-block';

        if (userAuthDiv) userAuthDiv.style.display = 'none';

        // Add logout button
        addLogoutButton();
    } else {
        // User not logged in
        if (welcomeHeader) welcomeHeader.style.display = 'none';
        if (userAuthDiv) userAuthDiv.style.display = 'flex';

        // Remove logout button
        removeLogoutButton();
    }
}

/* Event Listener for Login Form */
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

/* User-Defined Function - saveRegistrationData() */
/* Purpose: Stores a new user's complete registration data in local storage. */
/* Modified by: Jamarie McGlashen (2408376) - Added RegistrationData for invoices */
/* Creator: Tiffany Maragh 1705946 */
function saveRegistrationData(userData) {
    // Save to registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    registeredUsers.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // ============================================
    // ADDED FOR INVOICE SYSTEM: Save to RegistrationData
    // ============================================
    const registrationData = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    const invoiceUser = {
        trn: userData.trn,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dob: userData.dob,
        gender: userData.gender,
        phone: userData.phone,
        email: userData.email,
        dateRegistered: new Date().toLocaleDateString(),
        cart: [],
        invoices: [] // Empty array for future invoices
    };

    registrationData.push(invoiceUser);
    localStorage.setItem('RegistrationData', JSON.stringify(registrationData));
    // ============================================

    console.log("User registered:", userData.email, "Total registered users:", registeredUsers.length);
}
/* User-Defined Function - handleRegistrationSubmit() */
/* Purpose: Handles the registration form submission event. */
/* Creator: Tiffany Maragh 1705946 */ 
function handleRegistrationSubmit(event) {
    event.preventDefault(); // CRITICAL: Stop the browser from refreshing!
    validateForm(); 
}
/* User-Defined Function - validateForm() */
/* Purpose: Performs comprehensive client-side validation for all registration fields. */
/* Creator: Tiffany Maragh 1705946 */
function validateForm() {
    let isValid = true;
    const getField = (id) => document.getElementById(id);
    const clearError = (id) => {
        const span = document.getElementById(id);
        if (span) span.textContent = '';
    };

    ['first-name-error', 'last-name-error', 'username-error', 'email-error', 'password-error',
        'confirm-password-error', 'trn-error', 'phone-error', 'dob-error', 'gender-error'].forEach(clearError);

    const firstName = getField('reg-first-name').value.trim();
    const lastName = getField('reg-last-name').value.trim();
    const username = getField('reg-username').value.trim();
    const email = getField('reg-email').value.trim();
    const password = getField('reg-password').value;
    const confirmPassword = getField('reg-confirm-password').value;
    const trn = getField('reg-trn').value.trim();
    const phone = getField('reg-phone').value.trim();
    const dob = getField('reg-dob').value;
    const gender = getField('reg-gender').value;

    // Validation checks (same as original)
    if (firstName === '') {
        getField('first-name-error').textContent = 'First Name is required.';
        isValid = false;
    }
    if (lastName === '') {
        getField('last-name-error').textContent = 'Last Name is required.';
        isValid = false;
    }
    if (username === '') {
        getField('username-error').textContent = 'Username is required.';
        isValid = false;
    } else if (username.length < 5) {
        getField('username-error').textContent = 'Username must be at least 5 characters.';
        isValid = false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        getField('email-error').textContent = 'Email is required.';
        isValid = false;
    } else if (!regexEmail.test(email)) {
        getField('email-error').textContent = 'Invalid email format.';
        isValid = false;
    }

    if (password === '') {
        getField('password-error').textContent = 'Password is required.';
        isValid = false;
    } else if (password.length < 8) {
        getField('password-error').textContent = 'Password must be at least 8 characters.';
        isValid = false;
    }

    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordComplexityRegex.test(password)) {
        getField('password-error').textContent = "Password needs 1 uppercase, 1 lowercase, 1 number, 1 special character.";
        isValid = false;
    }

    if (password === '') {
        getField('confirm-password-error').textContent = 'Please confirm your password.';
        isValid = false;
    } else if (confirmPassword !== password) {
        getField('confirm-password-error').textContent = 'Passwords do not match.';
        isValid = false;
    }

    const regexTRN = /^\d{3}-\d{3}-\d{3}$/;
    if (trn === '') {
        getField('trn-error').textContent = 'TRN is required.';
        isValid = false;
    } else if (!regexTRN.test(trn)) {
        getField('trn-error').textContent = 'TRN must be exactly 9 digits in format 000-000-000.';
        isValid = false;
    } else {
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        if (registeredUsers.some(user => user.trn === trn)) {
            getField('trn-error').textContent = 'This TRN is already registered.';
            isValid = false;
        }
    }

    const regexPhone = /^(876)-\d{3}-\d{4}$/;
    if (phone === '') {
        getField('phone-error').textContent = 'Phone Number is required.';
        isValid = false;
    } else if (!regexPhone.test(phone)) {
        getField('phone-error').textContent = 'Phone Number must be in format 876-XXX-XXXX.';
        isValid = false;
    }

    if (dob === '') {
        getField('dob-error').textContent = 'Date of Birth is required.';
        isValid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            getField('dob-error').textContent = 'You must be at least 18 years old to register.';
            isValid = false;
        }
    }

    if (gender === '') {
        getField('gender-error').textContent = 'Please select a gender.';
        isValid = false;
    }

    if (isValid) {
        const userData = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
            trn: trn,
            phone: phone,
            dob: dob,
            gender: gender,
            registeredAt: new Date().toISOString()
            
        };
        //DEBUGGING TO FIND PASSWORD MISMATCH ISSUES
       // console.log("REGISTER DEBUG: Password being SAVED:", userData.password);
        saveRegistrationData(userData);
        alert('Registration Successful! You can now log in.');
        window.location.href = './login.html';
        return;
    }
    return false;
}

/* IA#2 Group Project: Event Handling - handleCancelRegistration() */
function handleCancelRegistration() {
    const confirmation = confirm("Are you sure you want to cancel your registration? All entered data will be lost.");
    if (confirmation) {
        window.location.href = '../index.html';
    }
}

/* Attach event listener to the Cancel Registration button */
        document.addEventListener('DOMContentLoaded', () => {
        const cancelRegButton = document.getElementById('cancel-registration-button');
        if (cancelRegButton) {
        cancelRegButton.addEventListener('click', handleCancelRegistration);
        }
    });




/* ============================
   PRODUCT LIST & ADD TO CART
   Dhi-andra Neath
============================ */
const products = [
    { id: 'M001', name: 'Strawberry Daifuku', price: 3.99, description: 'Pink strawberry mochi dessert.', image: '../Assets/Strawberry Cheesecake Mochi.png', category: 'mochi' },
    { id: 'M002', name: 'Matcha Cheesecake', price: 4.99, description: 'Creamy classic cheesecake with Japanese matcha.', image: '../Assets/matchaCheesecake.png', category: 'mochi' },
    { id: 'M003', name: 'Matcha Espresso Dango', price: 5.50, description: 'Colorful glutinous rice dessert on a skewer with matcha and espresso flavor', image: '../Assets/Matcha Espresso Dango.png', category: 'mochi' },
    { id: 'B001', name: 'Caramel Drizzle Scone', price: 4.25, description: 'A scone topped with caramel drizzle', image: '../Assets/Caramel Drizzle Scones.png', category: 'baked' },
    { id: 'B002', name: 'Cinnamon Swirl', price: 3.50, description: 'A warm, sticky cinnamon swirl.', image: '../Assets/Cinnamon Latte Swirls.png', category: 'baked' },
    { id: 'B003', name: 'Oat Milk Banana Bread', price: 4.75, description: 'Moist loaf of banana bread. Made with oat milk.', image: '../Assets/Oat Milk Banana Bread.png', category: 'baked' },
    { id: 'D003', name: 'The Daily Grind Coffee', price: 14.00, description: 'Bag of coffee beans.', image: '../Assets/House Blend - The Daily Grind.png', category: 'drink' },
    { id: 'D004', name: 'Single-Origin Beans', price: 18.50, description: 'Bag of premium single-origin espresso beans.', image: '../Assets/Single-Origin Espresso Beans.png', category: 'drink' },
    { id: 'D005', name: 'Matcha Latte Mix', price: 11.00, description: 'Packet of matcha latte mix.', image: '../Assets/Matcha Latte Mix.png', category: 'drink' },
    { id: 'D006', name: 'Caramel Drizzle Syrup', price: 7.50, description: 'Small bottle of caramel drizzle syrup.', image: '../Assets/Caramel Drizzle Syrup.png', category: 'drink' },
    { id: 'D007', name: 'Hojicha Tea Bags', price: 9.00, description: 'Box of Japanese Hojicha tea bags.', image: '../Assets/Japanese Hojicha Tea Bags.png', category: 'drink' },
    { id: 'D008', name: 'Yuzu Refresher', price: 6.00, description: 'Vibrant yuzu sparkling drink.', image: '../Assets/yuzu_drink.png', category: 'drink' },
];

/* Cart function */
/*Eligio Ortiz*/
/*24089990*/


function getUserCartKey() {
    const currentUserTRN = localStorage.getItem('currentUserTRN');
    return currentUserTRN ? `shoppingCart_${currentUserTRN}` : 'shoppingCart_guest';
}

function saveUserCart(cart) {
    const cartKey = getUserCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cart));
    console.log('Cart saved for user:', cartKey, 'Items:', cart.length);
}

function loadUserCart() {
    try {
        const cartKey = getUserCartKey();
        const cartData = localStorage.getItem(cartKey);

        if (!cartData) {
            const emptyCart = [];
            localStorage.setItem(cartKey, JSON.stringify(emptyCart));
            console.log('Created new empty cart for:', cartKey);
            return emptyCart;
        }

        const cart = JSON.parse(cartData);
        console.log('Cart loaded from:', cartKey, 'Items:', cart.length);
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error('Error loading user cart:', error);
        return [];
    }
}

function initializeUserCart() {
    if (!localStorage.getItem('currentUserTRN')) {
        localStorage.setItem('currentUserTRN', 'guest');
    }
}

function migrateGuestCart() {
    const oldCartKey = 'shoppingCart';
    const newCartKey = getUserCartKey();

    const oldCartData = localStorage.getItem(oldCartKey);

    if (oldCartData) {
        const oldCart = JSON.parse(oldCartData);
        if (Array.isArray(oldCart) && oldCart.length > 0) {
            const currentCart = loadUserCart();

            oldCart.forEach(oldItem => {
                const existingIndex = currentCart.findIndex(item => item.id === oldItem.id);
                if (existingIndex !== -1) {
                    currentCart[existingIndex].quantity += oldItem.quantity || 1;
                } else {
                    currentCart.push(oldItem);
                }
            });

            saveUserCart(currentCart);
            localStorage.removeItem(oldCartKey);
            console.log('Cart migrated successfully');
        }
    }
}

if (!localStorage.getItem('AllProducts')) {
    localStorage.setItem('AllProducts', JSON.stringify(products));
}

const allProducts = JSON.parse(localStorage.getItem('AllProducts')) || [];

function displayProducts() {
    const containers = {
        mochi: document.getElementById("mochi-products"),
        baked: document.getElementById("baked-products"),
        drink: document.getElementById("drink-products")
    };

    if (!containers.mochi || !containers.baked || !containers.drink) return;

    Object.values(containers).forEach(container => container.innerHTML = "");

    allProducts.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product-card");
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-button" onclick="addItemToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
        `;
        const target = containers[product.category];
        if (target) target.appendChild(div);
    });
}

/* IA#2: User-Defined Function - updateCartItemCount() */
/* Creator: Tiffany Maragh 1705946 */
function updateCartItemCount() {
    const cart = loadUserCart(); // CHANGED
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const countSpans = document.querySelectorAll('#cart-item-count, #cart-item-count-mobile');
    countSpans.forEach(span => {
        span.textContent = totalCount;
        span.style.display = totalCount > 0 ? 'inline-block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    
    // --- 0. INITIALIZE USER CART SYSTEM ---
    initializeUserCart();
    migrateGuestCart();
    
    // --- 1. HEADER & AUTHENTICATION SETUP ---
    checkLoginStatus(); 
    updateHeaderWelcomeMessage();
    updateCartItemCount(); 
    
    // --- 2. REGISTRATION FORM SUBMISSION FIX (CRITICAL) ---
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // ATTACHMENT FOR CANCEL BUTTONS
    const cancelRegButton = document.getElementById('cancel-reg-button');
    if (cancelRegButton) {
        cancelRegButton.addEventListener('click', handleCancelRegistration);
    }
    
    // --- 3. PAGE CONTENT SETUP ---
    displayProducts(); // Displays products on the product pages.
    
    // INVOICE PAGE SETUP
    if (window.location.pathname.includes('invoice.html')) {
        displayInvoice();
    }
    
    // CHECKOUT PAGE SETUP
    if (document.querySelector('.checkout-page-container')) {
        displayCheckoutSummary();
        attachCartItemListeners(); // Attach listeners for any cart controls rendered on checkout
    }
    
    // CHECKOUT/ORDER CANCELLATION
    const cancelButton = document.getElementById('cancel-button'); // Assumed Checkout Cancel
    if (cancelButton) {
        cancelButton.addEventListener('click', handleCancelOrder);
    }

    const confirmForm = document.getElementById('shipping-form');
    if (confirmForm) {
        confirmForm.addEventListener('submit', handleConfirmOrder);
    }
});


/* IA#2: User-Defined Function - addItemToCart() */
/* Creator: Tiffany Maragh 1705946 */
function addItemToCart(productId, productName, price, quantity = 1) {
    const cart = loadUserCart(); // CHANGED

    const idx = cart.findIndex(item => item.id === productId);
    if (idx !== -1) {
        cart[idx].quantity = (cart[idx].quantity || 0) + quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }

    saveUserCart(cart); // CHANGED
    updateCartItemCount();
    
    // Ask if user wants to go to cart
    const goToCart = confirm(`${productName} added to cart!\n\nWould you like to view your cart now?`);
    if (goToCart) {
        window.location.href = 'cart.html';
    }
}

/* IA#2: User-Defined Function - renderCartItems() */
/* Creator: Tiffany Maragh 1705946 */
function renderCartItems() {
    const cart = loadUserCart(); // CHANGED
    const itemListDiv = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('cart-empty-message');

    if (!itemListDiv || !emptyMessage) return;

    itemListDiv.innerHTML = '';

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        updateCartTotal();
        return;
    }

    emptyMessage.style.display = 'none';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        itemDiv.innerHTML = `
            <p class="item-name">${item.name}</p>
            <div class="item-controls">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        itemListDiv.appendChild(itemDiv);
    });

    updateCartTotal();
    attachCartItemListeners();
}

/* IA#2: User-Defined Function - updateCartTotal() */
/* Creator: Tiffany Maragh 1705946 */
function updateCartTotal() {
    const TAX_RATE = 0.15;
    const DISCOUNT_PERCENT = 0.10;

    const cart = loadUserCart(); // CHANGED
    let subTotal = 0;

    cart.forEach(item => {
        subTotal += (item.price * item.quantity) || 0;
    });

    const discountAmount = subTotal * DISCOUNT_PERCENT;
    const totalBeforeTax = subTotal - discountAmount;
    const taxAmount = totalBeforeTax * TAX_RATE;
    const finalTotal = totalBeforeTax + taxAmount;

    const format = (num) => num.toFixed(2);

    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) {
        subtotalEl.textContent = `$${format(subTotal)}`;
        if (discountEl) discountEl.textContent = `-$${format(discountAmount)}`;
        if (taxEl) taxEl.textContent = `$${format(taxAmount)}`;
        if (totalEl) totalEl.textContent = `$${format(finalTotal)}`;
    }

    return {
        subTotal: subTotal,
        discountAmount: discountAmount,
        taxAmount: taxAmount,
        finalTotal: finalTotal
    };
}
/*cart event listeners*/
/*Eligio Ortiz - 2408990*/
function attachCartItemListeners() {
    const removeButtons = Array.from(document.querySelectorAll('.remove-btn'));
    const increaseButtons = Array.from(document.querySelectorAll('.quantity-btn.increase'));
    const decreaseButtons = Array.from(document.querySelectorAll('.quantity-btn.decrease'));

    removeButtons.forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
        button.addEventListener('click', handleRemoveItem);
    });

    increaseButtons.forEach(button => {
        button.removeEventListener('click', handleQuantityChange);
        button.addEventListener('click', handleQuantityChange);
    });

    decreaseButtons.forEach(button => {
        button.removeEventListener('click', handleQuantityChange);
        button.addEventListener('click', handleQuantityChange);
    });

    const clearButton = document.getElementById('clear-cart-button');
    if (clearButton) {
        clearButton.removeEventListener('click', handleClearCart);
        clearButton.addEventListener('click', handleClearCart);
    }

    // Also attach change listeners to numeric inputs (in case user edits quantity)
    const quantityInputs = Array.from(document.querySelectorAll('.item-quantity'));
    quantityInputs.forEach(input => {
        input.removeEventListener('change', handleQuantityInputChange);
        input.addEventListener('change', handleQuantityInputChange);
    });
}

function handleQuantityChange(event) {
    const productId = event.target.dataset.id;
    const cart = loadUserCart();
    const item = cart.find(i => i.id === productId);

    if (!item) return;

    if (event.target.classList.contains('increase')) {
        item.quantity = (item.quantity || 0) + 1;
    } else if (event.target.classList.contains('decrease') && item.quantity > 1) {
        item.quantity = item.quantity - 1;
    }

    saveUserCart(cart);
    
    // Force immediate refresh of ALL cart displays
    refreshCartDisplay();
}

// Refresh function
function refreshCartDisplay() {
    console.log('Refreshing cart display...');
    
    // 1. Update cart count in header
    updateCartItemCount();
    
    // 2. If on cart page, refresh everything
    if (document.querySelector('.cart-page-container')) {
        renderCartItems(); // Re-render the items list
        updateCartTotal(); // Update the totals
    }
    
    // 3. If on checkout page, refresh summary
    if (document.querySelector('.checkout-page-container')) {
        displayCheckoutSummary();
    }
}

function handleQuantityInputChange(event) {
    const productId = event.target.dataset.id;
    const newVal = parseInt(event.target.value, 10);
    const cart = loadUserCart();
    const item = cart.find(i => i.id === productId);

    if (!item) return;

    if (isNaN(newVal) || newVal < 1) {
        event.target.value = item.quantity;
        return;
    }

    item.quantity = newVal;
    saveUserCart(cart);
    
    refreshCartDisplay();
}

function handleRemoveItem(event) {
    const productId = event.target.dataset.id;
    let cart = loadUserCart();
    cart = cart.filter(item => item.id !== productId);
    saveUserCart(cart);
    
    refreshCartDisplay();
}

function handleClearCart() {
    saveUserCart([]);

    refreshCartDisplay();
    
    alert('Your cart has been cleared!');
}

/* DOM initialization for cart.html: wire up buttons and render the cart */
document.addEventListener('DOMContentLoaded', () => {
// Only run this on the cart page to avoid errors on other pages
if (!document.querySelector('.cart-page-container')) return;

// Initial render and counters
renderCartItems();
updateCartItemCount();
attachCartItemListeners();

// Checkout button -> checkout page
const checkoutBtn = document.getElementById('checkout-button');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'checkout.html';
    });
}

// Continue shopping button -> products page
const continueBtn = document.getElementById('continue-shopping-button');
if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'products.html';
    });
}

// Ensure clear cart control (if outside attachCartItemListeners)
const clearBtn = document.getElementById('clear-cart-button');
if (clearBtn) clearBtn.addEventListener('click', handleClearCart);
});

/* IA#2: Function - displayCheckoutSummary() */
/* Creator: Tiffany Maragh 1705946 */

/*Group Project Question 4 Confirm Button & Cancel Button*/
/*Allana Dunkley 2300290 */
function displayCheckoutSummary() {
    const cart = loadUserCart(); // CHANGED
    updateCartTotal();

    const checkoutItemList = document.getElementById('checkout-item-list');
    const amountPaidInput = document.getElementById('amount-paid');

    if (!checkoutItemList) return;

    checkoutItemList.innerHTML = '';

    if (cart.length === 0) {
        checkoutItemList.innerHTML = '<p class="text-center">Your cart is empty. Please return to the products page.</p>';
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('summary-item');
        const lineTotal = item.price * item.quantity;
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${lineTotal.toFixed(2)}</span>
        `;
        checkoutItemList.appendChild(itemDiv);
    });

    const totals = updateCartTotal();
    if (amountPaidInput && totals && totals.finalTotal) {
        amountPaidInput.value = `$${totals.finalTotal.toFixed(2)}`;
    }
}


function handleCancelOrder() {
    const confirmation = confirm("Are you sure you want to cancel your order? Your cart will be cleared.");
    if (confirmation) {
        saveUserCart([]); // CHANGED
        alert("Order canceled. Cart cleared.");
        window.location.href = '../Codes/cart.html'; 
    }
}

/* GROUP PROJECT: INVOICE SYSTEM */
/* Purpose: Generate, store, and display invoices */
/* Creator: Jamarie McGlashen 2408376 */

function generateInvoice(shippingInfo) {
    const currentUser = localStorage.getItem('currentUserTRN');
    if (!currentUser) {
        alert('Error: No user logged in');
        return null;
    }

    const cart = loadUserCart(); // CHANGED
    if (cart.length === 0) {
        alert('Error: Cart is empty');
        return null;
    }

    const totals = updateCartTotal();
    const invoiceNumber = 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const invoice = {
        invoiceNumber: invoiceNumber,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customerTRN: currentUser,
        shippingInfo: shippingInfo,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            lineTotal: (item.price * item.quantity).toFixed(2)
        })),
        subtotal: totals.subTotal.toFixed(2),
        discount: totals.discountAmount.toFixed(2),
        tax: totals.taxAmount.toFixed(2),
        total: totals.finalTotal.toFixed(2),
        status: 'Paid'
    };

    // Store in AllInvoices
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    allInvoices.push(invoice);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));

    // Store in user's personal invoices
    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const userIndex = users.findIndex(user => user.trn === currentUser);

    if (userIndex !== -1) {
        if (!users[userIndex].invoices) users[userIndex].invoices = [];
        users[userIndex].invoices.push(invoice);
        localStorage.setItem('RegistrationData', JSON.stringify(users));
    }

    saveUserCart([]); // CHANGED: Clear cart using saveUserCart
    updateCartItemCount();
    localStorage.setItem('lastInvoice', JSON.stringify(invoice));

    return invoice;
}

function displayInvoice() {
    const invoiceData = JSON.parse(localStorage.getItem('lastInvoice'));
    const container = document.getElementById('invoice-content');

    if (!container) return;
    if (!invoiceData) {
        container.innerHTML = '<p class="error">No invoice found.</p>';
        return;
    }

    container.innerHTML = `
        <div class="invoice-header-info">
            <h2>Mochi Bakery & Cafe</h2>
            <p>Sweet Moments. Delivered.</p>
            <p>Email: info@mochibakerycafe.com | Phone: +1 678 555-MOCHI</p>
        </div>
        
        <div class="invoice-meta">
            <div class="meta-left">
                <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoiceData.date}</p>
                <p><strong>Time:</strong> ${invoiceData.time}</p>
            </div>
            <div class="meta-right">
                <p><strong>Customer TRN:</strong> ${invoiceData.customerTRN}</p>
                <p><strong>Status:</strong> <span class="status-paid">${invoiceData.status}</span></p>
            </div>
        </div>
        
        <div class="shipping-details">
            <h3><i class="fas fa-shipping-fast"></i> Shipping Information</h3>
            <p><strong>${invoiceData.shippingInfo.name}</strong></p>
            <p>${invoiceData.shippingInfo.address}</p>       
        </div>
        
        <table class="invoice-items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${item.lineTotal}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="invoice-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${invoiceData.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Discount (10%):</span>
                <span>-$${invoiceData.discount}</span>
            </div>
            <div class="summary-row">
                <span>Tax (15%):</span>
                <span>$${invoiceData.tax}</span>
            </div>
            <div class="summary-row grand-total">
                <span><strong>TOTAL:</strong></span>
                <span><strong>$${invoiceData.total}</strong></span>
            </div>
        </div>
        
        <div class="invoice-message">
            <p><i class="fas fa-envelope"></i> Invoice has been sent to your registered email.</p>
            <p class="thank-you">Thank you for your order!</p>
        </div>
    `;
}
//Function use to display all invoices in admin dashboard /Allana Dunkley
function ShowInvoices() {
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];

    console.log('=== ALL INVOICES ===');
    console.log(`Total invoices: ${allInvoices.length}`);

    if (allInvoices.length === 0) {
        console.log('No invoices found in the system.');
        return { count: 0, invoices: [], message: 'No invoices found' };
    }

    allInvoices.forEach(invoice => {
        console.log('------------------------');
        console.log(`Invoice #: ${invoice.invoiceNumber}`);
        console.log(`Date: ${invoice.date}`);
        console.log(`Customer TRN: ${invoice.customerTRN}`);
        console.log(`Total: $${invoice.total}`);
    });

    // Create a formatted display for the admin dashboard /Jamrie Mcglashen

    let formattedInvoices = '';
    allInvoices.forEach(invoice => {
        formattedInvoices += `
            <div class="invoice-item-display">
                <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoice.date} ${invoice.time || ''}</p>
                <p><strong>Customer TRN:</strong> ${invoice.customerTRN}</p>
                <p><strong>Total:</strong> $${invoice.total}</p>
                <p><strong>Status:</strong> ${invoice.status || 'Paid'}</p>
                <hr>
            </div>
        `;
    });

    return {
        count: allInvoices.length,
        invoices: allInvoices,
        formatted: formattedInvoices,
        message: `Found ${allInvoices.length} invoice(s) in the system.`
    };
}

function handleConfirmOrder(event) {
    event.preventDefault();

    const shippingInfo = {
        name: document.getElementById('shipping-name').value.trim(),
        address: document.getElementById('shipping-address').value.trim()
    };

    if (!shippingInfo.name) {
        alert("Please enter your Full Name for shipping.");
        return;
    }

    // Generate invoice
    const invoice = generateInvoice(shippingInfo);

    if (invoice) {
        // Redirect to invoice page
        window.location.href = 'invoice.html';
    } else {
        alert('Error generating invoice. Please try again.');
    }
}


function printInvoice() {
    window.print();
}

function ShowUserFrequency() {
    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    console.log('=== USER FREQUENCY ANALYSIS ===');
    console.log(`Total registered users: ${users.length}`);

    // 1. Gender Frequency
    const genderCount = { Male: 0, Female: 0, Other: 0 };

    users.forEach(user => {
        if (genderCount.hasOwnProperty(user.gender)) {
            genderCount[user.gender]++;
        } else {
            genderCount.Other++;
        }
    });

    console.log('\n--- GENDER DISTRIBUTION ---');
    console.log(`Male: ${genderCount.Male} users`);
    console.log(`Female: ${genderCount.Female} users`);
    console.log(`Other: ${genderCount.Other} users`);

    // 2. Age Group Frequency
    const ageGroups = {
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '50+': 0
    };

    users.forEach(user => {
        if (user.dob) {
            const birthDate = new Date(user.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age >= 18 && age <= 25) {
                ageGroups['18-25']++;
            } else if (age >= 26 && age <= 35) {
                ageGroups['26-35']++;
            } else if (age >= 36 && age <= 50) {
                ageGroups['36-50']++;
            } else if (age > 50) {
                ageGroups['50+']++;
            }
        }
    });

    console.log('\n--- AGE GROUP DISTRIBUTION ---');
    console.log(`18-25: ${ageGroups['18-25']} users`);
    console.log(`26-35: ${ageGroups['26-35']} users`);
    console.log(`36-50: ${ageGroups['36-50']} users`);
    console.log(`50+: ${ageGroups['50+']} users`);
}

function logout() {
    // Clear all user session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserTRN');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('lastInvoice');

    // Set back to guest
    localStorage.setItem('currentUserTRN', 'guest');
    
    // Update cart display
    updateCartItemCount();
    
    alert('You have been logged out successfully.');

    const currentPage = window.location.pathname;

    if (currentPage.includes('admin_dashboard.html')) {
        // From admin dashboard, go to login page
        window.location.href = 'login.html';
    } else if (currentPage.includes('Codes/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}
/*
   AUTO-HIDE LOGIN BUTTON WHEN LOGGED IN // Jaamarie Mcglashen
*/
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const welcomeHeader = document.getElementById('welcome-message-header');
    const userAuthDiv = document.querySelector('.user-auth');
    const loginButtons = document.querySelectorAll('a[href*="login.html"] button');

    if (currentUser && welcomeHeader) {
        // User is logged in
        welcomeHeader.textContent = `Welcome Back, ${currentUser}!`;
        welcomeHeader.style.display = 'inline-block';

        // Hide login button if it exists
        if (userAuthDiv) {
            userAuthDiv.style.display = 'none';
        }

        // Hide all login buttons in navigation
        loginButtons.forEach(button => {
            button.style.display = 'none';
        });

        // Add logout button dynamically if not already there
        addLogoutButton();
    } else {

        if (welcomeHeader) {
            welcomeHeader.style.display = 'none';
        }
        if (userAuthDiv) {
            userAuthDiv.style.display = 'flex';
        }

        // Remove logout button if exists
        removeLogoutButton();
    }
}

function addLogoutButton() {
    // Check if logout button already exists
    if (document.getElementById('logout-button')) return;

    const userInfoDiv = document.querySelector('.user-info-display');
    if (userInfoDiv) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-button';
        logoutBtn.className = 'logout-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logout;

        
        userInfoDiv.appendChild(document.createElement('br'));
        userInfoDiv.appendChild(logoutBtn);
    }
}

function removeLogoutButton() {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.remove();
    }
}

