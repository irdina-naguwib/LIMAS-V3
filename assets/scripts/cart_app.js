document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#cart-items-table tbody');
    const loggedInUser = localStorage.getItem('loggedInUser');  // Fetch the logged-in user
    const loggedInPhone = localStorage.getItem('loggedInPhone');
    const loggedInMatric = localStorage.getItem('loggedInMatric');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];  // Fetch the cart from localStorage
    const tarikhPinjam = localStorage.getItem('tarikhPinjam');  // Fetch Tarikh Pinjam
    const tarikhPulang = localStorage.getItem('tarikhPulang');  // Fetch Tarikh Pulang

    // Check if cart is empty
    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
        return;
    }

    // Fill in user details and borrowed items
    cart.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('cart-item');
    
        // Construct image URL
        const imageUrl = `assets/images/${item.name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    
        itemCard.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}" />
            <div class="cart-item-details">
                <h2>${item.name} (${item.code})</h2>
                <p>${loggedInUser} <br> ${loggedInPhone} <br> ${loggedInMatric}</p>
                <p>Requested Date: ${tarikhPinjam ? tarikhPinjam : 'Not set'}</p>
                <p>Returned Date: ${tarikhPulang ? tarikhPulang : 'Not set'}</p>
            </div>
        `;
    
        document.getElementById('cart-items-container').appendChild(itemCard);
    });
});

// Function to submit the cart and go to semakan pinjaman page
function submitCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Fetch the cart again
    const tarikhPinjam = localStorage.getItem('tarikhPinjam');
    const tarikhPulang = localStorage.getItem('tarikhPulang');

    // Check if the cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before submitting.');
        return; // Prevent submission
    }

    if (!tarikhPinjam || !tarikhPulang) {
        alert('Please make sure both borrow and return dates are set.');
        return;
    }

    const loggedInUser = localStorage.getItem('loggedInUser');

    // Prepare the borrow data for submission
    const borrowData = {
        butiran: loggedInUser,
        tarikh_pinjam: tarikhPinjam,
        tarikh_pulang: tarikhPulang,
        items_borrowed: cart,
        status: "pending",
        approver: null,
        approval_date: null
    };

    // Send the data to the backend using fetch (assuming /api/borrowed-items is available)
    fetch('/api/borrowed-items/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrowData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Your request has been submitted.');
        localStorage.removeItem('cart');  // Clear the cart after submission
        window.location.href = 'semakan_pinjaman.html';  // Redirect to semakan pinjaman page
    })
    .catch(error => {
        console.error('Error submitting request:', error);
    });
}

// Navigation to home page
function goToHome() {
    window.location.href = 'student_home.html';
}

// Navigation to linen selection page
function linenSelect() {
    window.location.href = 'linen_selection.html';
}
