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

    const checkoutSection = document.getElementById('checkout-section');
    const checkoutBtn = document.getElementById('checkout-btn');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutItemsList = document.getElementById('checkout-items');

    // Event listener for the checkout button
    checkoutBtn.addEventListener('click', () => {
        // Show the checkout section
        checkoutSection.classList.remove('hidden');

        // Fetch past orders and update the past orders section
        fetchPastOrders();
    });

    // // Event listener for the place order button
    // placeOrderBtn.addEventListener('click', () => {
    //     // Add logic to confirm the order and place it in the database
    //     // You may want to display a success message and update the UI
    //     console.log('Order placed successfully!');
    //     checkoutSection.classList.add('hidden'); // Hide the checkout section after placing the order
    // });

    // Function to process past orders and update the UI
    function processPastOrders(pastOrders) {
    // Clear existing content in the past orders section
    checkoutItemsList.innerHTML = '';
    totalPriceSpan.textContent = '';

    // Check if there are past orders
    if (pastOrders && pastOrders.length > 0) {
        // Iterate through past orders
        pastOrders.forEach(order => {
            // Create a list item for each order
            const orderItem = document.createElement('li');
            orderItem.innerHTML = `
                <strong>Order Date:</strong> ${new Date(order.order_date).toLocaleDateString()}<br>
                <strong>Items:</strong>
                <ul>
                    ${order.items.map(item => `<li>${item.description} - ${item.sku} - $${item.price}</li>`).join('')}
                </ul>
                <strong>Total Price:</strong> $${order.totalPrice.toFixed(2)}<br>
                ----------------------------------------
            `;
            // Append the order item to the checkout items list
            checkoutItemsList.appendChild(orderItem);
        });
        // Calculate and display the total price of all past orders
        const totalPrices = pastOrders.map(order => order.totalPrice);
        const totalPrice = totalPrices.reduce((sum, price) => sum + price, 0);
        totalPriceSpan.textContent = totalPrice.toFixed(2);
    } else {
        // Display a message when there are no past orders
        checkoutItemsList.innerHTML = '<p>No past orders available.</p>';
    }
}

    // Function to fetch and display past orders
    async function fetchPastOrders() {
        try {
            const response = await fetch('http://localhost:3000/orders');
            const pastOrders = await response.json();

            // Process the past orders and update the UI
            processPastOrders(pastOrders);

        } catch (error) {
            console.error('Error fetching past orders:', error);
        }
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

    // Function to check the entered password
    window.checkPassword = () => {
        const passwordInput = document.getElementById('password');
        const passwordScreen = document.getElementById('password-screen');

        const enteredPassword = passwordInput.value.trim(); // Get entered password

        // Replace 'yourSecretPassword' with your actual password
        if (enteredPassword === 'profit') {
            // Password is correct, hide the password screen and show the item container
            passwordScreen.style.display = 'none';
            itemContainer.style.display = 'grid';
        } else {
            // Password is incorrect, show an alert (you can replace this with a more user-friendly popup)
            alert('Incorrect password. Please try again.');
        }
    };
});

