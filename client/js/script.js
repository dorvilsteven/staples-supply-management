function findPrice(cart) {
    let orderSum = 0;
    cart.forEach(item => orderSum += parseFloat(item.price));
    return orderSum.toFixed(2);
} 
// Function to toggle the dropdown
function toggleDropdown(arrow) {
    const dropdownList = arrow.parentElement.nextElementSibling;

    // Toggle the 'open' class on the dropdown
    dropdownList.classList.toggle('hidden');
}


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
                cartItemElement.classList.add('cart-item'); // Add a class for styling
                
                const itemSku = document.createElement('span');
                itemSku.classList.add('item-sku');
                itemSku.innerText = `${itemInCart.sku}`;
                
                const itemDescription = document.createElement('span');
                itemDescription.classList.add('item-description');
                itemDescription.innerText = `${itemInCart.description}`;

                const itemPrice = document.createElement('span');
                itemPrice.classList.add('item-price');
                itemPrice.innerText = `$${itemInCart.price}`;

                // Create remove button
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-from-cart-btn');
                removeBtn.dataset.itemSku = itemInCart.sku; // Use dataset for data attributes
                removeBtn.innerText = 'Remove';
                removeBtn.addEventListener('click', () => removeFromCart(itemInCart.sku));

                // Append elements to the cartItemElement
                cartItemElement.appendChild(itemSku);
                cartItemElement.appendChild(itemDescription);
                cartItemElement.appendChild(itemPrice);
                cartItemElement.appendChild(removeBtn);

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
    const pastOrdersList = document.getElementById('pastorders-list');

    // Event listener for the checkout button
    checkoutBtn.addEventListener('click', () => {
        // Show the checkout section
        itemContainer.style.display = 'none';
        checkoutSection.classList.remove('hidden');

        // display order for checkout
        displayCartInCheckout(shoppingCart);
        // Fetch past orders and update the past orders section
        fetchPastOrders();
    });

    // // Event listener for the place order button
    placeOrderBtn.addEventListener('click', async () => {
        try {
            const orderDetails = {
                items_list: shoppingCart,
                quantity: shoppingCart.length,
                totalPrice: findPrice(shoppingCart)
            };
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails)
            });
            if (response.ok) {
                // Clear the shopping cart
                shoppingCart.length = 0;
                // Update the UI as needed (e.g., clear the cart display)
                updateCartDisplay();
                // Hide the checkout section and show the item container
                checkoutSection.classList.add('hidden');
                itemContainer.style.display = 'grid';
                // Display success message
                popup.style.display = 'block';
                popup.style.backgroundColor = '#ff0000';
                popup.style.color = '#000000';
                popup.innerHTML = `Order Placed`;
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 3000); // Hide the popup after 2 seconds
            } else {
                // Handle errors from the server
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
                alert(`Error placing order: ${errorData.error}`);
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Unexpected error placing order:', error);
            alert('Unexpected error placing order. Please try again.');
        }
    });


    // Function to display shopping cart in checkout
    function displayCartInCheckout(cartItems) {
        checkoutItemsList.innerHTML = '';
        cartItems.forEach((item) => {
            
            const cartListItem = document.createElement('li');
            cartListItem.classList.add('checkout-item'); // Add a class for styling

            const itemSku = document.createElement('span');
            itemSku.classList.add('item-sku');
            itemSku.innerText = `${item.sku}`;

            const itemDescription = document.createElement('span');
            itemDescription.classList.add('item-description');
            itemDescription.innerText = `${item.description}`;

            const itemPrice = document.createElement('span');
            itemPrice.classList.add('item-price');
            itemPrice.innerText = `$${item.price}`;

            // Append elements to the cartListItem
            cartListItem.appendChild(itemSku);
            cartListItem.appendChild(itemDescription);
            cartListItem.appendChild(itemPrice);

            checkoutItemsList.appendChild(cartListItem);
        });
        totalPriceSpan.innerText = findPrice(cartItems);
    }

    // Function to fetch and display past orders
    async function fetchPastOrders() {
        try {
            const response = await fetch('http://localhost:3000/orders');
            const pastOrders = await response.json();

            pastOrdersList.innerHTML = '';
            pastOrders.forEach(order => {
                const listItem = document.createElement('li');
                
                const itemsList = order.items_list.map(item => `
                    <li class="order-list-item">
                        <span>${item.sku}</span>
                        <span>${item.description}</span>
                        <span>${item.price}</span>
                    </li>
                `).join('');

                listItem.innerHTML = `
                    <div class="order-list-box">
                        <span class="order-id">Order ID: ${order.orderId}</span>
                        <span class="order-quantity">Quantity: ${order.quantity} items</a></span>
                        <span class="order-price">Price: ${order.totalPrice}</span>
                        <span class="order-dropdown arrow-down" onclick="toggleDropdown(this)"><i class="fa-solid fa-angle-down"></i></span>
                    </div>
                    <div class="dropdown hidden">
                        <ul class="order-items-list">
                            ${itemsList}
                        </ul>
                    </div>
                `;
                pastOrdersList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching past orders:', error);
        }
    }

    function removeFromCart(sku) {
        const itemIndex = shoppingCart.findIndex(item => item.sku === sku);
        if (itemIndex !== -1) {
            shoppingCart.splice(itemIndex, 1);
            deletePopup(sku);
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
            // Password is incorrect, show an alert
            popup.style.display = 'block';
            popup.style.backgroundColor = '#000000';
            popup.style.color = '#ffffff';
            popup.innerHTML = `Incorrect Password, Please Try Again.`;
            popup.style.zIndex = '1001';
            setTimeout(() => {
                popup.style.display = 'none';
                popup.style.zIndex = '1';
            }, 3000); // Hide the popup after 2 seconds
        }
    };

    window.backBtn = () => {
        // Hide the checkout section and show the item container
        checkoutSection.classList.add('hidden');
        itemContainer.style.display = 'grid';
    }
});

