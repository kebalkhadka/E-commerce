const cartBtn = document.getElementById("cart");
        const closeCart = document.getElementById("close-cart");
        const overlay = document.getElementById("cart-overlay");
        const cartList = document.getElementById("cart-list");
    
        cartBtn.onclick = () => {
            overlay.style.display = "block";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            cartList.style.animation = "cartlist 0.4s linear forwards";
        };
    
        closeCart.onclick = () => {
            cartList.style.animation = "cartlistclose 0.4s linear forwards";
            setTimeout(() => {
                overlay.style.display = "none";
                cartList.style.animation = ""; // Reset animation
                overlay.style.backgroundColor = "transparent";
            }, 400); // Adjust timing to match animation duration
        };


