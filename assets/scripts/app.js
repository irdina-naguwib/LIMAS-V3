// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const id_signin = document.getElementById('id_signin').value;
    const password = document.getElementById('password').value;
    
    // Load the JSON database
    fetch('/data/database.json')
        .then(response => response.json())
        .then(data => {
            const user = data.users.find(user => user.matric === id_signin && user.password === password);

            if (user) {
                // Store the user's name in localStorage
                localStorage.setItem('loggedInUser', user.name);
                localStorage.setItem('loggedInMatric', user.matric);
                localStorage.setItem('loggedInPhone', user.phone);

                // Redirect based on role
                if (user.role === 'student') {
                    window.location.href = 'student_home.html';
                } else if (user.role === 'admin') {
                    window.location.href = 'admin_home.html';
                }
            } else {
                document.getElementById('error-message').textContent = 'Invalid credentials. Please try again.';
            }
        });
});

// Show the sign-up form when the "Sign Up" button is clicked
document.getElementById('showSignUpForm').addEventListener('click', function () {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const signUpButton = document.getElementById('showSignUpForm');
    
    // Check if the sign-up form is currently hidden
    if (signUpForm.style.display === 'none' || signUpForm.style.display === '') {
        // Hide the login form and show the sign-up form
        loginForm.style.opacity = 0;
        setTimeout(() => {
            loginForm.style.display = 'none';  // Hide the login form completely after fade out
            signUpForm.style.display = 'block';  // Display sign-up form
            signUpForm.style.opacity = 0;  // Set initial opacity to 0 for transition effect
            setTimeout(() => {
                signUpForm.style.transition = 'opacity 0.5s ease';
                signUpForm.style.opacity = 1;  // Fade in the sign-up form
                signUpButton.textContent = "Back to Login";  // Change button text
            }, 10);
        }, 500);  // Delay for fade-out animation
    } else {
        // Hide the sign-up form and show the login form
        signUpForm.style.opacity = 0;
        setTimeout(() => {
            signUpForm.style.display = 'none';  // Hide the sign-up form completely
            loginForm.style.display = 'block';  // Display the login form
            loginForm.style.opacity = 0;  // Set initial opacity to 0 for transition effect
            setTimeout(() => {
                loginForm.style.transition = 'opacity 0.5s ease';
                loginForm.style.opacity = 1;  // Fade in the login form
                signUpButton.textContent = "Sign Up";  // Change button text back
            }, 10);
        }, 500);  // Delay for fade-out animation
    }
});

// Handle the sign-up form submission
document.getElementById('signUpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const ic = document.getElementById('ic_signup').value;
    const matric = document.getElementById('matric').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password_signup').value;

    const newUser = {
        name: name,
        ic: ic,
        matric: matric,
        phone: phone,
        email: email,
        password: password,
        role: 'student' // Role is automatically set to 'student'
    };

    console.log('Submitting new user:', newUser);  // Debug: Log the new user data

    // Send the new user data to the server
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);  // Should log "User registered successfully"
        alert('Registration successful! You can now log in.');

        // Reset button text and toggle forms
        document.getElementById('showSignUpForm').textContent = "Sign Up"; // Reset button text

        // Show the login form with transition
        const signUpForm = document.getElementById('signUpForm');
        const loginForm = document.getElementById('loginForm');

        signUpForm.style.opacity = 0;
        setTimeout(() => {
            signUpForm.style.display = 'none';
            loginForm.style.display = 'block';
            loginForm.style.opacity = 0;
            setTimeout(() => {
                loginForm.style.transition = 'opacity 0.5s ease';
                loginForm.style.opacity = 1;
            }, 10);
        }, 500);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error with the registration. Please try again.');
    });
});
