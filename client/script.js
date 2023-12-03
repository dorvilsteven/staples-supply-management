document.addEventListener('DOMContentLoaded', () => {
    const itemContainer = document.getElementById('item-container');
    const shoppingCart = [];

    // Fetch all items from the server and update the UI
    async function fetchItems() {
        try {
            const response = await fetch('http://localhost:3000/items');
            const items = await response.json();
            
            // Process the data and update the UI
            items.forEach(item => {
                // Create a div element for each item
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                // Create HTML content for the item
                const itemHTML = `
                    <div class="item-info">
                        <h3>${item.description}</h3>
                        <p>SKU: ${item.sku}</p>
                        <p>Price: $${item.price}</p>
                    </div>
                    <button class="add-to-cart-btn" data-item-sku="${item.sku}">Add to Cart</button>
                `;
                // Set the HTML content for the item div
                itemDiv.innerHTML = itemHTML;
                // Append the item div to the item container
                itemContainer.appendChild(itemDiv);
                // Add event listener for the "Add to Cart" button
                const addToCartBtn = itemDiv.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', () => {
                    addToCart(item);
                });
            });
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    // Initial fetch
    fetchItems();

    function addToCart(item) {
        // Check if the item is already in the cart
        const existingItem = shoppingCart.find(cartItem => cartItem.sku === item.sku);
        if (existingItem) {
            showPopup(true, item);
        } else {
            showPopup(false, item);
            shoppingCart.push(item);
        }
        // Update the cart display
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items');
        // clear current display of cart
        cartContainer.innerHTML = '';
        // render each item in cart
        shoppingCart.forEach(itemInCart => {
            if (itemInCart) {
                const cartItemElement = document.createElement('li');
                cartItemElement.innerHTML = `
                    <span>${itemInCart.description} - ${itemInCart.sku} - ${itemInCart.price}</span>
                    <button class="remove-from-cart-btn" data-item-sku="${itemInCart.sku}">Remove</button>
                `;
                cartContainer.appendChild(cartItemElement);
                
                // Add event listener for the "Remove from Cart" button
                const removeFromCartBtn = cartItemElement.querySelector('.remove-from-cart-btn');
                removeFromCartBtn.addEventListener('click', () => {
                    removeFromCart(itemInCart.sku);
                });
            }
        });
    }    

    function removeFromCart(sku) {
        const itemIndex = shoppingCart.findIndex(item => item.sku === sku);
        if (itemIndex !== -1) {
            shoppingCart.splice(itemIndex, 1);
            deletePopup(sku);
            console.log('Shopping cart: ', shoppingCart);
            updateCartDisplay();
        } else {
            console.error(`Item with SKU ${sku} not found in the cart.`);
        }
    }
    function deletePopup(sku) {
        popup.style.display = 'block';
        popup.style.backgroundColor = '#ffff99';
        popup.style.color = '#000000';
        popup.innerHTML = `This SKU: ${sku} has been removed from the cart`;
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000); // Hide the popup after 2 seconds
    }
    function showPopup(bool, item) {
        popup.style.display = 'block';
        if (bool) {
            popup.style.backgroundColor = '#ff6666';
            popup.innerHTML = `This SKU: ${item.sku} is already in the cart`;
        } else {
            popup.style.backgroundColor = '#4CAF50';
            popup.innerHTML = `This SKU: ${item.sku} has been added to the cart`;
        }
        setTimeout(() => {
            popup.style.display = 'none';
        }, 3000); // Hide the popup after 2 seconds
    }
});

