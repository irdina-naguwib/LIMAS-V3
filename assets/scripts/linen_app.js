// Initialize cart and linens data
let cart = [];
let linens = [];

// Load linen data from JSON and filter out borrowed items
function loadLinenData() {
    fetch('data/linen_items.json')  // Fetch available linens from JSON file
        .then(response => response.json())
        .then(data => {
            fetch('/api/borrowed-items')  // Fetch borrowed items with status from the API
                .then(response => response.json())
                .then(borrowedData => {
                    const borrowedCodes = borrowedData.borrowed_items
                        .filter(item => item.status === 'pending' || item.status === 'approved' || item.status === 'returned')
                        .flatMap(item => item.items_borrowed.map(i => i.code));  // Collect borrowed codes

                    // Process and filter out borrowed codes from linens
                    linens = Object.keys(data.items).flatMap(type => {
                        const category = data.items[type];
                        if (type === 'tablecloth') {
                            return Object.keys(category).flatMap(shape => {
                                return category[shape].map(item => ({
                                    type: type,
                                    shape: shape,
                                    name: item.name,
                                    codes: item.codes.filter(code => !borrowedCodes.includes(code)),
                                    image: `assets/images/${item.name.replace(/\s+/g, '_').toLowerCase()}.jpg`
                                }));
                            });
                        } else {
                            return category.map(item => ({
                                type: type,
                                name: item.name,
                                codes: item.codes.filter(code => !borrowedCodes.includes(code)),
                                image: `assets/images/${item.name.replace(/\s+/g, '_').toLowerCase()}.jpg`
                            }));
                        }
                    });

                    // Display filtered linens
                    filterLinen(); 
                });
        })
        .catch(error => {
            console.error('Error loading linen data:', error);
        });
}

// Function to filter and display linens based on filters (Type, Shape, Name)
function filterLinen() {
    const type = document.getElementById('type').value;
    const shape = document.getElementById('shape').value;
    const name = document.getElementById('name').value.toLowerCase();
    const results = document.getElementById('linen-results');
    results.innerHTML = '';  // Clear previous results

    // Debugging: Show current filters in console
    console.log(`Filter - Type: ${type}, Shape: ${shape}, Name: ${name}`);

    linens.forEach(item => {
        const matchesType = (type === '' || item.type === type);
        const matchesShape = (shape === '' || (item.shape && item.shape === shape));
        const matchesName = (name === '' || item.name.toLowerCase().includes(name));

        // Debugging: Show whether the item passes the filter
        console.log(`Item: ${item.name}, Matches Type: ${matchesType}, Matches Shape: ${matchesShape}, Matches Name: ${matchesName}`);

        if (matchesType && matchesShape && matchesName) {
            if (item.codes.length === 0) return;  // Skip if no available codes after filtering

            // Create a linen item element
            const linenElement = document.createElement('div');
            linenElement.classList.add('linen-item');
            linenElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <select id="linen-${item.name}">
                    <option value="">Select Code</option>
                    ${item.codes.map(code => `<option value="${code}">${code}</option>`).join('')}
                </select>
                <button onclick="addToCart('${item.name}', 'linen-${item.name}')">ADD TO CART</button>
            `;
            results.appendChild(linenElement);
        }
    });
}

// Function to add selected linen to cart
function addToCart(name, selectId) {
    const code = document.getElementById(selectId).value;
    if (code) {
        cart.push({ name, code });
        alert(`${name} (${code}) added to cart!`);
        localStorage.setItem('cart', JSON.stringify(cart));  // Save cart to localStorage
    } else {
        alert('Please select a code.');
    }
}

// Function to load and display linens when the page loads
document.addEventListener('DOMContentLoaded', loadLinenData);

// Add event listeners for filter change
document.getElementById('type').addEventListener('change', filterLinen);
document.getElementById('shape').addEventListener('change', filterLinen);
document.getElementById('name').addEventListener('input', filterLinen);


// Function to view the cart (redirect to the cart page)
function viewCart() {
    window.location.href = 'cart.html';
}

// Navigation functions
function goToHome() {
    window.location.href = 'student_home.html';
}

// Navigation functions
function goToBorang() {
    window.location.href = 'borang_permohonan.html';
}
