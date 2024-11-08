document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#borrowed-items-table tbody');
    const loggedInUser = localStorage.getItem('loggedInUser'); // Assume user is stored in localStorage
    const loggedInPhone = localStorage.getItem('loggedInPhone');
    const loggedInMatric = localStorage.getItem('loggedInMatric');

    // Fetch borrowed items from the JSON database
    fetch('/api/borrowed-items')  // Make sure this matches the route defined in your Node.js server
        .then(response => response.json())
        .then(data => {
            const userItems = data.borrowed_items.filter(item => item.butiran === loggedInUser);

            if (userItems.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No borrowed items found for this user.</td></tr>';
                return;
            }

            userItems.forEach(item => {
                const row = document.createElement('tr');
                
                // Format the items borrowed
                const itemsList = item.items_borrowed.map(i => `${i.name} (${i.code})`).join(', ');

                // Status cell with color-coding and approver
                let statusColor;
                let statusText = item.status;
                if (item.status === 'pending') {
                    statusColor = 'yellow';
                    statusText = 'Pending';
                } else if (item.status === 'approved') {
                    statusColor = '#90EE90';
                    statusText = `Approved by ${item.approver} on ${item.approval_date}`;
                } else if (item.status === 'returned') {
                    statusColor = 'orange';
                    statusText = 'Returned';
                } else if (item.status === 'accepted') {
                    statusColor = 'green';
                    statusText = `Accepted by ${item.approver} on ${item.approval_date}`;
                } else if (item.status === 'late') {
                    statusColor = 'red';
                    statusText = `Late returned on ${item.approval_date}`;
                }

                row.innerHTML = `
                    <td>${item.butiran} <br> ${loggedInPhone} <br> ${loggedInMatric}</td>
                    <td>${item.tarikh_pinjam}</td>
                    <td>${item.tarikh_pulang}</td>
                    <td>${itemsList}</td>
                    <td style="color: white; background-color: ${statusColor};">${statusText}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching borrowed items:', error);
            tableBody.innerHTML = '<tr><td colspan="5">Error loading data.</td></tr>';
        });
});

// Navigation function to go back to home
function goToHome() {
    window.location.href = 'student_home.html';
}
