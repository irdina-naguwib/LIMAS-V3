document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#approved-items-table tbody');
    const loggedInUser = localStorage.getItem('loggedInUser'); // Assume user is stored in localStorage

    // Fetch borrowed items and filter for approved items of the logged-in user
    fetch('/api/borrowed-items')
        .then(response => response.json())
        .then(data => {
            const approvedItems = data.borrowed_items.filter(item => 
                item.butiran === loggedInUser && item.status === 'approved'
            );

            if (approvedItems.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No approved items available for checkout.</td></tr>';
                return;
            }

            approvedItems.forEach(item => {
                const row = document.createElement('tr');
                const itemsList = item.items_borrowed.map(i => `${i.name} (${i.code})`).join(', ');

                row.innerHTML = `
                    <td><input type="checkbox" class="item-checkbox" data-butiran="${item.butiran}" data-tarikh_pinjam="${item.tarikh_pinjam}"></td>
                    <td>${item.butiran}</td>
                    <td>${item.tarikh_pinjam}</td>
                    <td>${item.tarikh_pulang}</td>
                    <td>${itemsList}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching approved items:', error);
            tableBody.innerHTML = '<tr><td colspan="5">Error loading data.</td></tr>';
        });
});

// Function to submit selected items for checkout
function submitCheckedItems() {
    const checkedItems = Array.from(document.querySelectorAll('.item-checkbox:checked')).map(checkbox => {
        return {
            butiran: checkbox.getAttribute('data-butiran'),
            tarikh_pinjam: checkbox.getAttribute('data-tarikh_pinjam'),
            status: 'returned'
        };
    });

    if (checkedItems.length === 0) {
        alert('Please select items to checkout.');
        return;
    }

    // Send each checked item to the server to update only its status to 'returned'
    checkedItems.forEach(item => {
        // Fetch current data for the specific item and update only the status
        fetch('/api/borrowed-items')
            .then(response => response.json())
            .then(data => {
                const itemToUpdate = data.borrowed_items.find(
                    borrowedItem => borrowedItem.butiran === item.butiran && borrowedItem.tarikh_pinjam === item.tarikh_pinjam
                );

                if (itemToUpdate) {
                    // Set only the status to "returned"
                    itemToUpdate.status = item.status;

                    // Send updated item data back to the server
                    fetch('/api/borrowed-items/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemToUpdate)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message);
                        // Optionally refresh the page to show updated status or remove checked rows
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error updating item status:', error);
                        alert('An error occurred while updating item status.');
                    });
                } else {
                    console.error('Item not found for update.');
                    alert('Selected item not found for update.');
                }
            })
            .catch(error => {
                console.error('Error fetching borrowed items:', error);
                alert('Error fetching items for status update.');
            });
    });
}

// Function to go back to the homepage for the user
function goToHome() {
    window.location.href = 'student_home.html';
}
