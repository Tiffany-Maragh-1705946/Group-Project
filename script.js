/* IA#2: Event Handling - Mobile Menu Toggle */
/* Purpose: To open and close the mobile navigation menu on click. */
/* Creator: Tiffany Maragh 1705946 */


const menuToggleButton = document.getElementById('mobile-menu-toggle'); 
const mobileMenu = document.getElementById('mobile-nav-menu'); 

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    

    const icon = menuToggleButton.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
        menuToggleButton.setAttribute('aria-label', 'Close Menu');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
        menuToggleButton.setAttribute('aria-label', 'Open Menu');
    }
}

// 3. Attach the event listener to the button
if (menuToggleButton) { 
    menuToggleButton.addEventListener('click', toggleMobileMenu);
}

function handleLogin(event) {
    // Prevent the form from submitting normally (reloading the page)
    event.preventDefault();

    // Define the specific, single set of credentials for demonstration
    const VALID_USERNAME = 'MochiLover';
    const VALID_PASSWORD = 'password123';

    // 1. Get input values (DOM Manipulation)
    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value.trim();

    // --- Start: Authentication Check (Control Structures) ---
    // Check if the input matches the hardcoded values
    if (usernameInput === VALID_USERNAME && passwordInput === VALID_PASSWORD) {

        // --- SUCCESS ---
        // 2. Store User Session Data (Local Storage)
        localStorage.setItem('currentUser', usernameInput);

        // 3. Update UI (DOM Manipulation)
        // Ensure the path to index.html is correct.
        updateHeaderWelcomeMessage(usernameInput);

        // 4. Redirect to the homepage
        alert('Login Successful! Welcome ' + usernameInput);
        window.location.href = '../index.html'; 

    } else {

        // --- FAILURE ---
        // Provide feedback for failed login attempt (DOM Update)
        alert('Login Failed: Incorrect username or password.');

        // Optional: Clear the password field after failure
        document.getElementById('login-password').value = '';
    }
}


/* Helper function to check login status and update ALL pages */
function updateHeaderWelcomeMessage(username) {
    const welcomeHeader = document.getElementById('welcome-message-header');

    if (username && welcomeHeader) {
        // Change the text content to display the username
        welcomeHeader.textContent = `Welcome Back, ${username}!`;

        // Hide the Login/Register buttons/links (DOM Manipulation)
        const userAuthDiv = document.querySelector('.user-auth');
        if (userAuthDiv) {
            userAuthDiv.style.display = 'none';
        }
    }
}

// 5. Check login status when ANY page loads
// This ensures "Welcome Back" shows up even on the homepage after login
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('currentUser');
    if (storedUsername) {
        updateHeaderWelcomeMessage(storedUsername);
    }
});

/*       Event Listener for Login Form */
const loginForm = document.getElementById('login-form');

if (loginForm) {
    // Event Handling: Listens for the 'submit' action on the form
    loginForm.addEventListener('submit', handleLogin);
}

/* User-Defined Function - saveRegistrationData() */
/* Purpose: Stores a new user's complete registration data in local storage. */
/* Creator: Tiffany Maragh 1705946 */
function saveRegistrationData(userData){
    // Retrieve existing registration data or initialize an empty array
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    // Add the new user's data to the array
    registeredUsers.push(userData);
    // Save the updated array back to local storage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    console.log("User registered:", userData.email, "Total registered users:", registeredUsers.length);

}

/* User-Defined Function - validateForm() */
/* Purpose: Performs comprehensive client-side validation for all registration fields. */
/* Creator: Tiffany Maragh 1705946 */

function validateForm() {
    let isValid = true; // Flag to track overall form validity
    // Helper to get element and clear previous error message
    const getField = (id) => document.getElementById(id);
    const clearError = (id) => {
        const span = document.getElementById(id);
        if (span) span.textContent = '';
    };
    // Clear all previous error messages
    ['first-name-error', 'last-name-error', 'username-error', 'email-error',  'password-error', 'confirm-password-error', 'trn-error', 'phone-error', 'dob-error', 'gender-error' ].forEach(clearError);

    //Get form field values
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

    // Validation Checks for Each Field
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
    }   else if (!regexEmail.test(email)) {
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
    // Add more password complexity checks (e.g., uppercase, lowercase, number, special character)
    const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordComplexityRegex.test(password)) {
        getField('password-error').textContent = "Password needs 1 uppercase, 1 lowercase, 1 number, 1 special character.";
        isValid = false;
    }
    //confirm password check
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
    } else { //check for duplicate TRN in system to prevent multiple registrations
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        if (registeredUsers.some(user => user.trn === trn)) {
            getField('trn-error').textContent = 'This TRN is already registered.';
            isValid = false;
        }
    }
    //phone number 
    const regexPhone = /^(876)-\d{3}-\d{4}$/; // Example: 876-XXX-XXXX
    if (phone === '') {
        getField('phone-error').textContent = 'Phone Number is required.';
        isValid = false;
    } else if (!regexPhone.test(phone)) {
        getField('phone-error').textContent = 'Phone Number must be in format 876-XXX-XXXX.';
        isValid = false;
    }
    //date of birth where the age must be at least 18
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
    //gender
    if (gender === '') {            
        getField('gender-error').textContent = 'Please select a gender.';
        isValid = false;
    }
    // After all validations, if valid, save the data
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
        saveRegistrationData(userData); //Saves the user data to local storage
        alert('Registration Successful! You can now log in.');
        window.location.href = './login.html'; //redirect to login page after successful registration
        return;
    }
    return false; // prevent form submission due to validation errors
}

/* IA#2 Group Project: Event Handling - handleCancelRegistration() 
    Purpose: Handles the cancellation of the registration process.*/
function handleCancelRegistration() {   
    const confirmation = confirm("Are you sure you want to cancel your registration? All entered data will be lost.");
    if (confirmation) {
        // Redirect to the homepage or products page
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



    /*IA#2: Event Handling - Cart Sidebar Toggle
    Creator: Tiffany Maragh 1705946 */

const cartSidebar = document.getElementById('cart-sidebar');
const openCartButtons = document.querySelectorAll('.cart-link'); // Selects all cart icons
const closeCartButton = document.getElementById('close-cart-button');

// Function to open the cart sidebar
function openCartSidebar(event) {
// Prevent navigation if the user clicks a cart link
    if (event) {
        event.preventDefault(); 
    }
    cartSidebar.classList.add('open');
    // CORRECTED: Call the main rendering function directly
    renderCartItems(); 
}

// Function to close the cart sidebar
function closeCartSidebar() {
    cartSidebar.classList.remove('open');
}

// Attach event listeners to all cart icons
openCartButtons.forEach(button => {
    button.addEventListener('click', openCartSidebar);
});

// Attach event listener to the close button
if (closeCartButton) {
    closeCartButton.addEventListener('click', closeCartSidebar);
}

/* IA#2: User-Defined Function - updateCartItemCount() */
/* Purpose: To update the cart item count displayed in the header based on Local Storage data. */
/* Creator: Tiffany Maragh 1705946 */
function updateCartItemCount() {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all count spans
    const countSpans = document.querySelectorAll('#cart-item-count, #cart-item-count-mobile');
    countSpans.forEach(span => {
        span.textContent = totalCount;
        // Show/hide the counter bubble based on the count
        span.style.display = totalCount > 0 ? 'inline-block' : 'none';
    });
}

// Call updateCartItemCount on page load
document.addEventListener('DOMContentLoaded', updateCartItemCount);

/* IA#2: User-Defined Function - addItemToCart() */
/* Purpose: To dynamically add a new product item to the shopping cart array and update the view. */
/* Creator: Tiffany Maragh 1705946 */
function addItemToCart(productId, productName, price, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    // 1. Check if item exists (Control Structure)
    let itemFound = cart.find(item => item.id === productId);

    if (itemFound) {
        // If item exists, increase quantity
        itemFound.quantity += quantity;
    } else {
        // If item is new, add it to the cart array
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }

    // 2. Save the updated cart back to Local Storage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    // 3. Update the item count in the header
    updateCartItemCount();

    // 4. Update the sidebar view and open it (DOM Manipulation)
    renderCartItems(); 
    openCartSidebar(); 
}

/* IA#2: User-Defined Function - renderCartItems() */
/* Purpose: To dynamically populate the Cart Sidebar with items from Local Storage. */
/* Creator: Tiffany Maragh 1705946 */
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const itemListDiv = document.getElementById('cart-items-list');
    const emptyMessage = document.getElementById('cart-empty-message');

    // Clear existing content
    itemListDiv.innerHTML = ''; 

    if (cart.length === 0) {
        emptyMessage.style.display = 'block'; // Show empty message
        updateCartTotal(); // Update totals to $0.00
        return;
    }

    emptyMessage.style.display = 'none'; // Hide empty message

    // Loop through the cart array and build HTML for each item
    cart.forEach(item => {
        const itemDiv = document.createElement('div'); // Create a new <div> element
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
        itemListDiv.appendChild(itemDiv); // Add the new item HTML to the list container
    });
    
    // Call the function to calculate and update totals
    updateCartTotal();
    
    // Attach event listeners to the new quantity/remove buttons after rendering
    attachCartItemListeners(); 
}
// Function to calculate and update cart totals
/* IA#2: User-Defined Function - updateCartTotal() */
/* Purpose: To recalculate the sub-total, tax, discount, and the final total on the cart page. */
/* Creator: Tiffany Maragh 1705946 */
function updateCartTotal() {
    // Define constants for calculations
    const TAX_RATE = 0.15; // 15% Tax (Assignment context)
    const DISCOUNT_PERCENT = 0.10; // 10% Discount (Assignment context)
    
    // 1. Load the cart
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    let subTotal = 0;

    // 2. Calculate Sub-Total (Control Structure: loop through items)
    cart.forEach(item => {
        // Correct arithmetic calculation
        subTotal += item.price * item.quantity; 
    });

    // 3. Apply Discount and Tax Calculations (Arithmetic)
    const discountAmount = subTotal * DISCOUNT_PERCENT;
    const totalBeforeTax = subTotal - discountAmount;
    const taxAmount = totalBeforeTax * TAX_RATE;
    const finalTotal = totalBeforeTax + taxAmount;
    
    // 4. Round values for currency display
    const format = (num) => num.toFixed(2);

    // 5. Update the DOM in the Cart Sidebar (DOM Manipulation)
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) { // Check if elements exist before updating
        subtotalEl.textContent = `$${format(subTotal)}`;
        discountEl.textContent = `-$${format(discountAmount)}`;
        taxEl.textContent = `$${format(taxAmount)}`;
        totalEl.textContent = `$${format(finalTotal)}`;
    }
    // Return the calculated values 
    return { 
        subTotal: subTotal, 
        discountAmount: discountAmount,
        taxAmount: taxAmount,
        finalTotal: finalTotal 
    };
}

// Function to attach event listeners to cart item buttons
/* IA#2: Event Handling - Item Controls (Remove/Quantity) */
/* Purpose: Attaches click listeners to dynamically created cart item buttons. */
/* Creator: Tiffany Maragh 1705946 */
function attachCartItemListeners() {
    // Get all dynamically generated buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    
    // Attach remove listeners
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
    
    // Attach quantity change listeners
    increaseButtons.forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    decreaseButtons.forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    
    // Attach Clear All listener
    const clearButton = document.getElementById('clear-cart-button');
    if (clearButton) {
        clearButton.addEventListener('click', handleClearCart);
    }
}

// Handler function definitions
function handleQuantityChange(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let item = cart.find(i => i.id === productId);

    if (item) {
        if (event.target.classList.contains('increase')) {
            item.quantity++;
        } else if (event.target.classList.contains('decrease') && item.quantity > 1) {
            item.quantity--;
        }
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCartItems(); // Re-render the cart list
}

function handleRemoveItem(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    // Filter out the item to be removed
    cart = cart.filter(item => item.id !== productId); 
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCartItems(); // Re-render the cart list
}

function handleClearCart() {
    // Clear the storage and update the view
    localStorage.removeItem('shoppingCart');
    updateCartItemCount();
    renderCartItems(); 
    closeCartSidebar(); // Close the sidebar after clearing
    alert('Your cart has been cleared!');
}

/* IA#2: Function - displayCheckoutSummary() */
/* Purpose: Populates the item list and financial summary on checkout.html. */
/* Creator: Tiffany Maragh 1705946 */
function displayCheckoutSummary() {
    // 1. Get the cart data and calculated totals
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    // Ensure updateCartTotal runs to get the latest totals and returns the raw numbers
    // We modify updateCartTotal slightly to be runnable and return values if needed,
    // but here we just rely on it updating the DOM elements with the IDs from checkout.html
    updateCartTotal(); // This function already updates the Summary IDs if they exist
    
    // 2. Get the item list container
    const checkoutItemList = document.getElementById('checkout-item-list');
    const amountPaidInput = document.getElementById('amount-paid');
    
    // Clear previous items
    checkoutItemList.innerHTML = ''; 

    if (cart.length === 0) {
        checkoutItemList.innerHTML = '<p class="text-center">Your cart is empty. Please return to the products page.</p>';
        return;
    }

    let finalTotalValue = 0;
    
    // 3. Populate the itemized list
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('summary-item');
        
        const lineTotal = item.price * item.quantity;
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${lineTotal.toFixed(2)}</span>
        `;
        checkoutItemList.appendChild(itemDiv);
        finalTotalValue = finalTotalValue; // Just to ensure the variable is defined
    });
    
    // 4. Update the "Amount Being Paid" field with the final total
    // Call updateCartTotal again to ensure we get the final value from the DOM or calculation
    const totals = updateCartTotal(); // Assuming updateCartTotal returns an object with totals
    
    // If updateCartTotal returned the final total:
    if (amountPaidInput && totals && totals.finalTotal) {
        amountPaidInput.value = `$${totals.finalTotal.toFixed(2)}`;
    }
    
    // If updateCartTotal does NOT return totals (check your previous code):
    // const totalElement = document.getElementById('summary-total').textContent;
    // if (amountPaidInput && totalElement) {
    //     amountPaidInput.value = totalElement;
    // }
}
/* IA#2: Checkout Page Event Listeners */

// Run when the Checkout page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the required elements for checkout exist (prevents errors on other pages)
    if (document.querySelector('.checkout-page-container')) {
        // Populate the cart details
        displayCheckoutSummary(); 
        // Attach event listeners for cart item controls right after page load
    // This makes sure the quantity +/- buttons are functional immediately
        attachCartItemListeners();
    }
    
    // Attach listener to the Cancel Order button
    const cancelButton = document.getElementById('cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', handleCancelOrder);
    }
    
    // Attach listener to the Confirm & Pay button
    const confirmForm = document.getElementById('shipping-form');
    if (confirmForm) {
        confirmForm.addEventListener('submit', handleConfirmOrder);
    }
});

/* Handler Functions */

function handleCancelOrder() {
    const confirmation = confirm("Are you sure you want to cancel your order? Your cart will be cleared.");
    if (confirmation) {
        // Clears the cart data and redirects to the products page
        localStorage.removeItem('shoppingCart');
        alert("Order canceled. Cart cleared.");
        window.location.href = '../Codes/products.html'; 
    }
}

function handleConfirmOrder(event) {
    event.preventDefault(); // Stop form submission
    
    // Simple front-end validation check (Can be expanded with more logic)
    const shippingName = document.getElementById('shipping-name').value.trim();
    if (shippingName.length === 0) {
        alert("Please enter your Full Name for shipping.");
        return;
    }

    alert("Order Confirmed! Thank you for purchasing from Mochi Bakery & Cafe.");
    
    // Final action: Clear cart and redirect to homepage
    localStorage.removeItem('shoppingCart');
    window.location.href = '../index.html'; 
}