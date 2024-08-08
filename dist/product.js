// Fetch products and populate the product list
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        const productHere = document.getElementById('producthere');
        data.products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product', 'border', 'rounded', 'p-4', 'shadow-lg', 'bg-white', 'product-item');

            productDiv.innerHTML = `
                <div>
                    <div><img src="${product.image}" alt="${product.name}" class="w-[300px] h-[300px]"></div>
                    <a href="#" class="product-name font-semibold text-xl pb-1.5 hover:text-[#0068C8] cursor-pointer" data-name="${product.name}" data-details="${product.details}">${product.name}</a>
                    <div class="pb-2.5">
                        <i class="ri-star-fill text-yellow-400 text-xl"></i>
                        <i class="ri-star-fill text-yellow-400 text-xl"></i>
                        <i class="ri-star-fill text-yellow-400 text-xl"></i>
                        <i class="ri-star-fill text-yellow-400 text-xl"></i>
                    </div>
                    <div class="flex items-center gap-6">
                        <div class="text-2xl font-bold text-red-500 pb-2">$${product.price}</div>
                        <button class="quantity-decrease border px-2.5 py-0.5 font-semibold">-</button>
                        <p class="font-semibold" id="quantity-${product.id}">1</p>
                        <button class="quantity-increase border px-2.5 py-0.5 font-semibold">+</button>
                    </div>
                    <button class="add-to-cart font-bold text-2xl px-15 py-2.5 border-[2px] border-[#0068C8] rounded hover:text-white hover:bg-[#0068C8] width-full" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">ADD TO CART</button>
                </div>
            `;

            productHere.appendChild(productDiv);
        });

        // Attach event listeners after the products are appended to the DOM
        attachEventListeners();
    })
    .catch(error => console.error('Error fetching the JSON data:', error));

const attachEventListeners = () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const target = event.currentTarget;
            const productItem = target.closest('.product-item');

            const itemId = target.getAttribute('data-id');
            const itemName = target.getAttribute('data-name');
            const itemImage = productItem.querySelector('img').getAttribute('src');
            const itemPrice = parseFloat(target.getAttribute('data-price'));
            const itemQuantity = parseInt(productItem.querySelector(`#quantity-${itemId}`).textContent);

            addToCart(itemId, itemName, itemPrice, itemImage, itemQuantity);
        });
    });

    const quantityIncreaseButtons = document.querySelectorAll('.quantity-increase');
    quantityIncreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productItem = button.closest('.product-item');
            const itemId = productItem.querySelector('.add-to-cart').getAttribute('data-id');
            const quantityElement = productItem.querySelector(`#quantity-${itemId}`);
            let quantity = parseInt(quantityElement.textContent);
            if (quantity < 10) {
                quantity++;
                quantityElement.textContent = quantity;
            }
        });
    });

    const quantityDecreaseButtons = document.querySelectorAll('.quantity-decrease');
    quantityDecreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productItem = button.closest('.product-item');
            const itemId = productItem.querySelector('.add-to-cart').getAttribute('data-id');
            const quantityElement = productItem.querySelector(`#quantity-${itemId}`);
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });
    });
};

const addToCart = (id, name, price, image, quantity) => {
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        const newItem = { id, name, price, image, quantity };
        cart.push(newItem);
    }
    updateCart();
    updateCartCount();
    updateTotalPrice();
};

let cart = [];

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
        updateCartCount();
        updateTotalPrice();
    }
}

function updateCartCount() {
    let totalCount = 0;
    cart.forEach(item => {
        totalCount += item.quantity;
    });

    const cartCountElement = document.getElementById('cartCount');
    cartCountElement.textContent = totalCount > 0 ? totalCount : "0";
    cartCountElement.classList.remove('hidden');
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
    }
    updateCart();
    updateCartCount();
    updateTotalPrice();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'items-center', 'border-b', 'py-2');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 mr-4">
            <div class="flex flex-col">
                <div class="flex justify-evenly gap-2 mb-2">
                    <p class="text-xl font-semibold mr-2">${item.name}</p>
                    <p id="quantity-${item.id}" class="mx-2 text-xl font-semibold">${item.quantity}</p>
                    <p class="text-gray-600 text-xl font-semibold">$${item.price}</p>
                    <button class="deleteButton text-xl text-red-500" data-id="${item.id}"><i class="ri-delete-bin-6-line"></i></button>
                </div>
            </div>
        `;

        const deleteButton = cartItemElement.querySelector('.deleteButton');
        deleteButton.addEventListener('click', function () {
            const itemId = this.getAttribute('data-id');
            removeFromCart(itemId);
        });

        cartItemsContainer.appendChild(cartItemElement);
    });
    saveCartToLocalStorage();
}

function updateTotalPrice() {
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    return totalPrice;
}

document.addEventListener('DOMContentLoaded', function () {
    loadCartFromLocalStorage();

    const closeCartButton = document.getElementById('close-cart');
    if (closeCartButton) {
        closeCartButton.addEventListener('click', function () {
            document.getElementById('cart-overlay').classList.add('hidden');
        });
    }
});

function sendCartToCheckout() {
    const cartData = JSON.stringify(cart);
    const totalPrice = updateTotalPrice();
    const checkoutUrl = `checkout.html?cart=${encodeURIComponent(cartData)}&total=${totalPrice.toFixed(2)}`;
    window.location.href = checkoutUrl;
}

function ViewCart() {
    const cartData = JSON.stringify(cart);
    const totalPrice = updateTotalPrice();
    const viewUrl = `cart.html?cart=${encodeURIComponent(cartData)}&total=${totalPrice.toFixed(2)}`;
    window.location.href = viewUrl;
}
