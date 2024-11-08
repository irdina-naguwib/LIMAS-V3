// Load the logged-in user's name into the Butiran field
document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loggedInPhone = localStorage.getItem('loggedInPhone');
    const loggedInMatric = localStorage.getItem('loggedInMatric');
    console.log(loggedInMatric);
    console.log(loggedInUser);
    console.log(loggedInPhone);

    if (loggedInUser) {
        document.getElementById('butiran').value = loggedInUser.toUpperCase();  // Auto-fill the butiran field
        document.getElementById('phone').value = loggedInPhone;  // Auto-fill the butiran field
        document.getElementById('matrix').value = loggedInMatric;  // Auto-fill the butiran field
    } else {
        alert('No logged-in user found. Please log in.');
        window.location.href = 'login.html';  // Redirect to login page if no user is logged in
    }
});

document.getElementById('permohonanForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tarikhPinjam = document.getElementById('tarikh_pinjam').value;
    const tarikhPulang = document.getElementById('tarikh_pemulangan').value;

    if (!tarikhPinjam || !tarikhPulang) {
        alert('Please select both borrow and return dates.');
        return;
    }

    // Store Tarikh Pinjam and Tarikh Pulang in localStorage
    localStorage.setItem('tarikhPinjam', tarikhPinjam);
    localStorage.setItem('tarikhPulang', tarikhPulang);

    // Proceed to the next page
    window.location.href = 'linen_selection.html';
});

// Navigation function to go back to the home page
function goToHome() {
    window.location.href = 'student_home.html';
}
