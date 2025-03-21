// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggle hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Utility function to show messages
    const showMessage = (elementId, message, type) => {
        const messageDiv = document.getElementById(elementId);
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'message';
            }, 3000); // Clear message after 3 seconds
        }
    };

    // Utility function to show loading spinner
    const showLoading = (button) => {
        button.classList.add('loading');
        button.disabled = true;
    };

    const hideLoading = (button) => {
        button.classList.remove('loading');
        button.disabled = false;
    };

    // Validation Functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]{3,}$/;
        return nameRegex.test(name);
    };

    // Real-Time Validation for Inputs
    const addRealTimeValidation = (input, validationFn, messageId, errorMessage) => {
        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (!value || !validationFn(value)) {
                input.classList.add('invalid');
                showMessage(messageId, errorMessage, 'error');
            } else {
                input.classList.remove('invalid');
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                const value = input.value.trim();
                if (validationFn(value)) {
                    input.classList.remove('invalid');
                }
            }
        });
    };

    // Password Visibility Toggle
    const togglePasswordElements = document.querySelectorAll('.toggle-password');
    togglePasswordElements.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggle.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggle.textContent = '👁️';
            }
        });
    });

    // Sign Up Form Handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const submitButton = signupForm.querySelector('button');

        // Real-time validation
        addRealTimeValidation(fullNameInput, validateName, 'signup-message', 'Full name must be at least 3 characters long and contain only letters and spaces.');
        addRealTimeValidation(emailInput, validateEmail, 'signup-message', 'Please enter a valid email address.');
        addRealTimeValidation(passwordInput, validatePassword, 'signup-message', 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).');

        confirmPasswordInput.addEventListener('blur', () => {
            if (confirmPasswordInput.value !== passwordInput.value) {
                confirmPasswordInput.classList.add('invalid');
                showMessage('signup-message', 'Passwords do not match.', 'error');
            } else {
                confirmPasswordInput.classList.remove('invalid');
            }
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                showMessage('signup-message', 'All fields are required.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateName(fullName)) {
                fullNameInput.classList.add('invalid');
                showMessage('signup-message', 'Full name must be at least 3 characters long and contain only letters and spaces.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateEmail(email)) {
                emailInput.classList.add('invalid');
                showMessage('signup-message', 'Please enter a valid email address.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validatePassword(password)) {
                passwordInput.classList.add('invalid');
                showMessage('signup-message', 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).', 'error');
                hideLoading(submitButton);
                return;
            }

            if (password !== confirmPassword) {
                confirmPasswordInput.classList.add('invalid');
                showMessage('signup-message', 'Passwords do not match.', 'error');
                hideLoading(submitButton);
                return;
            }

            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email)) {
                emailInput.classList.add('invalid');
                showMessage('signup-message', 'Email already exists.', 'error');
                hideLoading(submitButton);
                return;
            }

            // Save user to localStorage
            users.push({ fullName, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            showMessage('signup-message', 'Sign Up successful! Redirecting to Sign In...', 'success');

            // Redirect to Sign In page after 2 seconds
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        });
    }

    // Sign In Form Handling
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        const emailInput = document.getElementById('signin-email');
        const passwordInput = document.getElementById('signin-password');
        const submitButton = signinForm.querySelector('button');

        // Real-time validation
        addRealTimeValidation(emailInput, validateEmail, 'signin-message', 'Please enter a valid email address.');

        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Validation
            if (!email || !password) {
                showMessage('signin-message', 'All fields are required.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateEmail(email)) {
                emailInput.classList.add('invalid');
                showMessage('signin-message', 'Please enter a valid email address.', 'error');
                hideLoading(submitButton);
                return;
            }

            // Check credentials
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (!user) {
                showMessage('signin-message', 'Invalid email or password.', 'error');
                hideLoading(submitButton);
                return;
            }

            // Simulate login by storing user session
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            showMessage('signin-message', 'Sign In successful! Redirecting to Home...', 'success');

            // Redirect to Home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    // Forgot Password Form Handling
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        const emailInput = document.getElementById('forgot-email');
        const submitButton = forgotForm.querySelector('button');

        // Real-time validation
        addRealTimeValidation(emailInput, validateEmail, 'forgot-message', 'Please enter a valid email address.');

        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const email = emailInput.value.trim();

            // Validation
            if (!email) {
                showMessage('forgot-message', 'Email is required.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateEmail(email)) {
                emailInput.classList.add('invalid');
                showMessage('forgot-message', 'Please enter a valid email address.', 'error');
                hideLoading(submitButton);
                return;
            }

            // Check if email exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email);

            if (!user) {
                showMessage('forgot-message', 'Email not found.', 'error');
                hideLoading(submitButton);
                return;
            }

            // Simulate sending a reset link
            showMessage('forgot-message', 'Password reset link sent to your email!', 'success');

            // Redirect to Sign In page after 2 seconds
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        });
    }

    // Update Header to Show Logged-In User
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const authLink = document.querySelector('.auth a');
    if (loggedInUser && authLink) {
        authLink.textContent = `Logout (${loggedInUser.fullName})`;
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'signin.html';
        });
    }
});