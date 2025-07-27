document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');
    const stockTableBody = document.querySelector('#stockTable tbody');
    const messageDiv = document.getElementById('message');

    let stockItems = []; // Array to hold our stock data

    // --- Helper Functions ---
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // --- Local Storage Functions ---
    function saveItemsToLocalStorage() {
        localStorage.setItem('stockItems', JSON.stringify(stockItems));
    }

    function loadItemsFromLocalStorage() {
        const storedItems = localStorage.getItem('stockItems');
        if (storedItems) {
            stockItems = JSON.parse(storedItems);
        } else {
            stockItems = []; // Initialize if nothing found
        }
    }

    // --- Render Stock Table ---
    function renderStockTable() {
        stockTableBody.innerHTML = ''; // Clear existing rows
        stockItems.forEach(item => {
            const row = stockTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.name;
            row.insertCell().textContent = item.quantity;
            row.insertCell().textContent = item.price.toFixed(2); // Format price

            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            // Update Quantity Input and Button
            const updateQuantityInput = document.createElement('input');
            updateQuantityInput.type = 'number';
            updateQuantityInput.value = item.quantity;
            updateQuantityInput.min = "0";
            updateQuantityInput.style.width = '60px';
            updateQuantityInput.style.marginRight = '5px';
            actionsCell.appendChild(updateQuantityInput);

            const updateQuantityBtn = document.createElement('button');
            updateQuantityBtn.textContent = 'Update Qty';
            updateQuantityBtn.className = 'update-btn';
            updateQuantityBtn.onclick = () => {
                const newQuantity = parseInt(updateQuantityInput.value);
                if (isNaN(newQuantity) || newQuantity < 0) {
                    showMessage('Please enter a valid quantity.', 'error');
                    return;
                }
                updateItem(item.id, newQuantity, null); // Only update quantity
            };
            actionsCell.appendChild(updateQuantityBtn);

            // Update Price Input and Button
            const updatePriceInput = document.createElement('input');
            updatePriceInput.type = 'number';
            updatePriceInput.value = item.price.toFixed(2);
            updatePriceInput.min = "0";
            updatePriceInput.step = "0.01";
            updatePriceInput.style.width = '60px';
            updatePriceInput.style.marginRight = '5px';
            actionsCell.appendChild(updatePriceInput);

            const updatePriceBtn = document.createElement('button');
            updatePriceBtn.textContent = 'Update Price';
            updatePriceBtn.className = 'update-btn';
            updatePriceBtn.onclick = () => {
                const newPrice = parseFloat(updatePriceInput.value);
                if (isNaN(newPrice) || newPrice < 0) {
                    showMessage('Please enter a valid price.', 'error');
                    return;
                }
                updateItem(item.id, null, newPrice); // Only update price
            };
            actionsCell.appendChild(updatePriceBtn);


            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => {
                if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                    deleteItem(item.id);
                }
            };
            actionsCell.appendChild(deleteBtn);
        });
    }

    // --- CRUD Operations (Local Storage) ---

    // Add Item
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('itemName').value.trim();
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const price = parseFloat(document.getElementById('itemPrice').value);

        if (!name || isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
            showMessage('Please fill in all fields correctly.', 'error');
            return;
        }

        // Check for duplicate name
        if (stockItems.some(item => item.name.toLowerCase() === name.toLowerCase())) {
            showMessage('Item with this name already exists!', 'error');
            return;
        }

        const newItem = {
            id: stockItems.length > 0 ? Math.max(...stockItems.map(item => item.id)) + 1 : 1, // Simple ID generation
            name: name,
            quantity: quantity,
            price: price
        };

        stockItems.push(newItem);
        saveItemsToLocalStorage();
        renderStockTable();
        addItemForm.reset();
        showMessage('Item added successfully!', 'success');
    });

    // Update Item
    function updateItem(id, newQuantity, newPrice) {
        const itemIndex = stockItems.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            if (newQuantity !== null) {
                stockItems[itemIndex].quantity = newQuantity;
            }
            if (newPrice !== null) {
                stockItems[itemIndex].price = newPrice;
            }
            saveItemsToLocalStorage();
            renderStockTable(); // Re-render to show updated values
            showMessage('Item updated successfully!', 'success');
        } else {
            showMessage('Item not found for update.', 'error');
        }
    }

    // Delete Item
    function deleteItem(id) {
        const initialLength = stockItems.length;
        stockItems = stockItems.filter(item => item.id !== id);
        if (stockItems.length < initialLength) {
            saveItemsToLocalStorage();
            renderStockTable();
            showMessage('Item deleted successfully!', 'success');
        } else {
            showMessage('Item not found for deletion.', 'error');
        }
    }

    // --- Initial Load ---
    loadItemsFromLocalStorage();
    renderStockTable();
});
