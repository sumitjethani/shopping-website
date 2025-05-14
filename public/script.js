document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    const cartLink = document.querySelector('.cart');
    let userId = localStorage.getItem('userId');

    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9); // Temporary; replace with auth
        localStorage.setItem('userId', userId);
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    const showMessage = (elementId, message, type) => {
        const messageDiv = document.getElementById(elementId);
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'message';
            }, 5000);
        }
    };

    const showLoading = (button) => {
        button.classList.add('loading');
        button.disabled = true;
    };

    const hideLoading = (button) => {
        button.classList.remove('loading');
        button.disabled = false;
    };

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

    const validateMessage = (message) => {
        return message.trim().length >= 10;
    };

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

    const cart = [];

    const updateCartDropdown = () => {
        const cartDropdown = document.querySelector('.cart-dropdown');
        const cartCount = document.querySelector('.cart-count');
        if (cartDropdown) {
            cartDropdown.innerHTML = '';
            if (cart.length === 0) {
                cartDropdown.innerHTML = '<p>Your cart is empty.</p>';
                cartCount.textContent = '';
                return;
            }
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                    <button class="remove-from-cart" data-index="${index}">Remove</button>
                `;
                cartDropdown.appendChild(cartItem);
            });
            const checkout = document.createElement('div');
            checkout.className = 'checkout';
            checkout.innerHTML = '<button id="checkout">Checkout</button>';
            cartDropdown.appendChild(checkout);
            cartCount.textContent = `(${cart.length})`;
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const product = {
                name: e.target.parentElement.querySelector('h3').textContent,
                price: e.target.parentElement.querySelector('p').textContent.replace('$', ''),
                image: e.target.parentElement.querySelector('img').src
            };
            console.log('Adding product to cart:', product); // Debugging log
            cart.push(product);
            updateCartDropdown();
        }

        if (e.target.classList.contains('remove-from-cart')) {
            const index = e.target.dataset.index;
            console.log('Removing product from cart at index:', index); // Debugging log
            cart.splice(index, 1);
            updateCartDropdown();
        }

        if (e.target.id === 'checkout') {
            console.log('Redirecting to checkout page'); // Debugging log
            window.location.href = 'checkout.html';
        }
    });

    document.querySelector('.cart').addEventListener('click', () => {
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (cartDropdown) {
            cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
        }
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                name: e.target.parentElement.querySelector('h3').textContent,
                price: e.target.parentElement.querySelector('p').textContent.replace('$', ''),
                image: e.target.parentElement.querySelector('img').src
            };
            console.log('Adding product to cart:', product); // Debugging log
            cart.push(product);
            updateCartDropdown();
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message-text');
        const submitButton = contactForm.querySelector('button');

        addRealTimeValidation(nameInput, validateName, 'contact-message', 'Full name must be at least 3 characters long and contain only letters and spaces.');
        addRealTimeValidation(emailInput, validateEmail, 'contact-message', 'Please enter a valid email address.');
        addRealTimeValidation(messageInput, validateMessage, 'contact-message', 'Message must be at least 10 characters long.');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                showMessage('contact-message', 'All fields are required.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateName(name)) {
                nameInput.classList.add('invalid');
                showMessage('contact-message', 'Full name must be at least 3 characters long and contain only letters and spaces.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateEmail(email)) {
                emailInput.classList.add('invalid');
                showMessage('contact-message', 'Please enter a valid email address.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validateMessage(message)) {
                messageInput.classList.add('invalid');
                showMessage('contact-message', 'Message must be at least 10 characters long.', 'error');
                hideLoading(submitButton);
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/mail/send-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    body: JSON.stringify({ name, email, message }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('contact-message', data.message, 'success');
                    contactForm.reset();
                } else {
                    showMessage('contact-message', data.error || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Contact form submission error:', error);
                showMessage('contact-message', 'Cannot connect to the server. Please ensure the server is running and try again.', 'error');
            } finally {
                hideLoading(submitButton);
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const submitButton = signupForm.querySelector('button');

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

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

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

            try {
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    body: JSON.stringify({ fullName, email, password }),
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    showMessage('signup-message', data.message, 'success');
                    localStorage.setItem('loggedInUser', JSON.stringify({ fullName, email }));
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 2000);
                } else {
                    showMessage('signup-message', data.error, 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('signup-message', 'Cannot connect to the server. Please try again later.', 'error');
            } finally {
                hideLoading(submitButton);
            }
        });
    }

    // Signin Form
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        const emailInput = document.getElementById('signin-email');
        const passwordInput = document.getElementById('signin-password');
        const submitButton = signinForm.querySelector('button');

        addRealTimeValidation(emailInput, validateEmail, 'signin-message', 'Please enter a valid email address.');

        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const email = emailInput.value.trim();
            const password = passwordInput.value;

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

            try {
                const response = await fetch('http://localhost:3000/api/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    showMessage('signin-message', data.message, 'success');
                    localStorage.setItem('loggedInUser', JSON.stringify({ fullName: data.fullName, email }));
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    showMessage('signin-message', data.error, 'error');
                }
            } catch (error) {
                console.error('Signin error:', error);
                showMessage('signin-message', 'Cannot connect to the server. Please try again later.', 'error');
            } finally {
                hideLoading(submitButton);
            }
        });
    }

    // Forgot Password Form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        const emailInput = document.getElementById('forgot-email');
        const submitButton = forgotForm.querySelector('button');

        addRealTimeValidation(emailInput, validateEmail, 'forgot-message', 'Please enter a valid email address.');

        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const email = emailInput.value.trim();

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

            try {
                const response = await fetch('http://localhost:3000/api/mail/send-reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    body: JSON.stringify({ email }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('forgot-message', data.message, 'success');
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 2000);
                } else {
                    showMessage('forgot-message', data.error || 'Failed to send reset email.', 'error');
                }
            } catch (error) {
                console.error('Forgot password submission error:', error);
                showMessage('forgot-message', 'An error occurred while sending the reset email. Please try again later.', 'error');
            } finally {
                hideLoading(submitButton);
            }
        });
    }

    // Reset Password Form
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const submitButton = resetForm.querySelector('button');

        addRealTimeValidation(newPasswordInput, validatePassword, 'reset-message', 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).');

        confirmPasswordInput.addEventListener('blur', () => {
            if (confirmPasswordInput.value !== newPasswordInput.value) {
                confirmPasswordInput.classList.add('invalid');
                showMessage('reset-message', 'Passwords do not match.', 'error');
            } else {
                confirmPasswordInput.classList.remove('invalid');
            }
        });

        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading(submitButton);

            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!newPassword || !confirmPassword) {
                showMessage('reset-message', 'All fields are required.', 'error');
                hideLoading(submitButton);
                return;
            }

            if (!validatePassword(newPassword)) {
                newPasswordInput.classList.add('invalid');
                showMessage('reset-message', 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).', 'error');
                hideLoading(submitButton);
                return;
            }

            if (newPassword !== confirmPassword) {
                confirmPasswordInput.classList.add('invalid');
                showMessage('reset-message', 'Passwords do not match.', 'error');
                hideLoading(submitButton);
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email');
            const token = urlParams.get('token');

            if (!email || !token) {
                showMessage('reset-message', 'Invalid or expired reset link.', 'error');
                hideLoading(submitButton);
                return;
            }

            const expectedToken = Buffer.from(email).toString('base64');
            if (token !== expectedToken) {
                showMessage('reset-message', 'Invalid or expired reset link.', 'error');
                hideLoading(submitButton);
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === email);
            if (userIndex === -1) {
                showMessage('reset-message', 'User not found.', 'error');
                hideLoading(submitButton);
                return;
            }

            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            showMessage('reset-message', 'Password reset successful! Redirecting to Sign In...', 'success');

            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        });
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const authLink = document.querySelector('.auth a');
    if (loggedInUser && authLink) {
        authLink.textContent = `Logout (${loggedInUser.fullName})`;
        authLink.href = '#';
        authLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('http://localhost:3000/api/cart/clear', {
                    method: 'DELETE',
                    headers: {
                        'X-User-ID': userId
                    },
                    credentials: 'include'
                });
            } catch (error) {
                console.error('Error clearing cart on logout:', error);
            }
            localStorage.removeItem('loggedInUser');
            window.location.href = 'signin.html';
        });
    }

    const loadProducts = async (endpoint, containerId) => {
        try {
            const response = await fetch(endpoint);
            const products = await response.json();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>$${product.price}</p>
                        <button class="add-to-cart">Add to Cart</button>
                    `;
                    container.appendChild(productDiv);
                });
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    // Load products for each collection
    loadProducts('/api/products/men', 'men-collection');
    loadProducts('/api/products/women', 'women-collection');
    loadProducts('/api/products/best-selling', 'best-selling');

    const filterProducts = (category) => {
        const menSection = document.getElementById('men-collection');
        const womenSection = document.getElementById('women-collection');
        const bestSellingSection = document.getElementById('best-selling');

        if (category === 'men') {
            menSection.style.display = 'flex';
            womenSection.style.display = 'none';
            bestSellingSection.style.display = 'flex';
        } else if (category === 'women') {
            menSection.style.display = 'none';
            womenSection.style.display = 'flex';
            bestSellingSection.style.display = 'flex';
        } else {
            menSection.style.display = 'none';
            womenSection.style.display = 'none';
            bestSellingSection.style.display = 'flex';
        }
    };

    document.querySelector('a[href="#men-collection"]').addEventListener('click', (e) => {
        e.preventDefault();
        filterProducts('men');
    });

    document.querySelector('a[href="#women-collection"]').addEventListener('click', (e) => {
        e.preventDefault();
        filterProducts('women');
    });

    // Initially show best-selling products only
    filterProducts();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                name: e.target.parentElement.querySelector('h3').textContent,
                price: e.target.parentElement.querySelector('p').textContent.replace('$', ''),
                image: e.target.parentElement.querySelector('img').src
            };
            console.log('Adding product to cart:', product); // Debugging log
            cart.push(product);
            updateCartDropdown();
        });
    });
});