document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const cartBtn = document.getElementById('cart-btn');

    cartBtn.addEventListener('click', () => {
        // Check if the cart is closed (right is set to '-300px')
        if (cartContainer.style.right === '-50%') {
            // Open the cart by setting right to '0'
            cartContainer.style.right = '0';
            cartBtn.innerHTML = `<i class="fa-solid fa-x"></i>`;
        } else {
            // Close the cart by setting right to '-300px'
            cartContainer.style.right = '-50%';
            cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>`;
        }
    });
});
