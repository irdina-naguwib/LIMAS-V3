// Fetch user data from the previous login state
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    document.getElementById('admin').textContent = (loggedInUser || 'admin').toUpperCase();
});

let borrowedItems = [];
let loggedInUser = localStorage.getItem('loggedInUser'); // Get logged-in user from localStorage

// Fetch borrowed items from the server
async function fetchBorrowedItems() {
    const response = await fetch('/api/borrowed-items');
    const data = await response.json();
    borrowedItems = data.borrowed_items;
    displayTable(borrowedItems);
}

// Display borrowed items in the table
function displayTable(items) {
    const tableBody = document.querySelector("#borrowedItemsTable tbody");
    tableBody.innerHTML = ""; // Clear the existing table rows

    items.forEach((item, index) => {
        const itemsBorrowedText = item.items_borrowed.map(i => `${i.name} (${i.code})`).join(', ');

        const row = `
            <tr>
                <td>${item.butiran}</td>
                <td>${item.tarikh_pinjam}</td>
                <td>${item.tarikh_pulang}</td>
                <td>${itemsBorrowedText}</td>
                <td>
                    <select id="statusSelect-${index}">
                        <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="approved" ${item.status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="returned" ${item.status === 'returned' ? 'selected' : ''}>Returned</option>
                        <option value="accepted" ${item.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                        <option value="late" ${item.status === 'late' ? 'selected' : ''}>Late Return</option>
                    </select>
                </td>
                <td id="approver-${index}">${item.approver || 'No approver'}</td>
                <td id="approvalDate-${index}">${item.approval_date || 'N/A'}</td>
                <td><button onclick="saveChanges(${index})">Save</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Save the changes for a specific item
function saveChanges(index) {
    const newStatus = document.getElementById(`statusSelect-${index}`).value;
    const currentItem = borrowedItems[index];

    // Verify that the logged-in user is set correctly
    const currentUser = loggedInUser || 'admin';

    // Update the status, approver, and approval date
    currentItem.status = newStatus;
    currentItem.approver = currentUser; // Assign the logged-in user correctly
    currentItem.approval_date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Update the DOM immediately for feedback
    document.getElementById(`approver-${index}`).innerText = currentUser;
    document.getElementById(`approvalDate-${index}`).innerText = currentItem.approval_date;

    // Send the updated data to the server to save in the JSON file
    fetch('/api/borrowed-items/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentItem),
    })
    .then(response => {
        // Check if the response is ok and if the content-type is JSON
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data.message);
        alert('Changes saved successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to save changes. Check the console for details.');
    });
}

// Filter table based on status
function filterTable() {
    const filterValue = document.getElementById("statusFilter").value;
    const filteredItems = borrowedItems.filter(item => 
        filterValue === 'all' || item.status === filterValue
    );
    displayTable(filteredItems);
}

// Fetch and display borrowed items on page load
fetchBorrowedItems();

// Log out and redirect to login page
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}
