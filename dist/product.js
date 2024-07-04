// Fetch products and populate the product list
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        const productHere = document.getElementById('producthere');
        data.products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product', 'border', 'rounded', 'p-4', 'shadow-lg', 'bg-white', 'product-item'); // Added 'product-item' class

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
      <div class="flex items-center gap-5">
        <div class="text-2xl font-bold text-red-500">$${product.price}</div>
        <div class="flex items-center space-x-2">
          <button class="quantity-btn minus-btn cursor-pointer px-3 py-1 border rounded">-</button>
          <span class="quantity px-2 font-semibold">1</span>
          <button class="quantity-btn plus-btn cursor-pointer px-3 py-1 border rounded">+</button>
        </div>
      </div>
      <button class="add-to-cart mt-1 font-bold text-2xl px-5 border-[2px] border-[#0068C8] rounded py-2.5 hover:text-white hover:bg-[#0068C8]" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">ADD TO CART</button>
    </div>
  `;

  // Append productDiv to productHere container
  productHere.appendChild(productDiv);

  // Get quantity elements for this product
  const minusBtn = productDiv.querySelector('.minus-btn');
  const plusBtn = productDiv.querySelector('.plus-btn');
  const quantitySpan = productDiv.querySelector('.quantity');

  // Add event listeners for decrementing quantity
  minusBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantitySpan.textContent);
    if (currentQuantity > 1) {
      currentQuantity--;
      quantitySpan.textContent = currentQuantity;
    }
  });

  // Add event listeners for incrementing quantity
  plusBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantitySpan.textContent);
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
  });
});

        // Attach add to cart event listeners after the products are appended to the DOM
        addAddToCartListeners();
        attachProductDetailListeners();
    })
    .catch(error => console.error('Error fetching the JSON data:', error));

    const addAddToCartListeners = () => {
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
            const itemQuantity = parseInt(productItem.querySelector('.quantity').textContent); // Get the current quantity

            addToCart(itemId, itemName, itemPrice, itemImage, itemQuantity);

            showToast(`${itemName} added to cart`);
        });
    });
};


const showToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 3000);
};

// Function to handle adding items to the cart
const addToCart = (id, name, price, image, quantity) => {
    const existingItemIndex = cart.findIndex(item => item.id === id);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity; // Add quantity to existing item
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
    return totalPrice; // Return the total price for use in checkout
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
    const totalPrice = updateTotalPrice(); // Ensure total price is up-to-date
    const checkoutUrl = `checkout.html?cart=${encodeURIComponent(cartData)}&total=${totalPrice.toFixed(2)}`;
    window.location.href = checkoutUrl;
}

function ViewCart() {
    const cartData = JSON.stringify(cart);
    const totalPrice = updateTotalPrice(); // Ensure total price is up-to-date
    const viewUrl = `cart.html?cart=${encodeURIComponent(cartData)}&total=${totalPrice.toFixed(2)}`;
    window.location.href = viewUrl;
}



