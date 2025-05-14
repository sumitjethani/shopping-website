const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const mailRoutes = require('./routes/mailRoutes');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Define Cart Schema
const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{
        name: String,
        price: Number,
        image: String
    }]
});
const Cart = mongoose.model('Cart', cartSchema);

// Define User Schema for email validation and signup
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Configure connect-mongo with mongoUrl option
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
});

// Session Middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

// Log environment variables for debugging
console.log('Environment variables loaded:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[REDACTED]' : 'MISSING');
console.log('SUPPORT_EMAIL:', process.env.SUPPORT_EMAIL);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '[REDACTED]' : 'MISSING');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Assign or retrieve userId from session
app.use((req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = 'user_' + Math.random().toString(36).substr(2, 9); // Simple user ID (replace with auth in production)
    }
    req.userId = req.session.userId;
    next();
});

// API Routes
app.use('/api/mail', mailRoutes);
app.use('/api/products', productRoutes);

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        req.session.userId = newUser._id.toString(); // Store MongoDB _id as userId
        res.status(200).json({ message: 'Sign Up successful!' });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Signin Route
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }
        // Assuming passwords are hashed, compare the provided password
        const isMatch = password === user.password; // Replace with bcrypt.compare if hashed
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }
        req.session.userId = user._id.toString(); // Store MongoDB _id as userId
        res.status(200).json({ message: 'Signin successful!' });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Cart Routes
app.get('/api/cart', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({ userId: req.userId, products: [] });
            await cart.save();
        }
        res.status(200).json({ cart: cart.products });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/cart/add', async (req, res) => {
    const { product } = req.body;
    if (!product || !product.name || !product.price || !product.image) {
        return res.status(400).json({ error: 'Invalid product data' });
    }
    try {
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({ userId: req.userId, products: [] });
        }
        cart.products.push(product);
        await cart.save();
        res.status(200).json({ message: `${product.name} added to cart!`, cart: cart.products });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cart/clear', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.userId });
        if (cart) {
            cart.products = [];
            await cart.save();
        }
        res.status(200).json({ message: 'Cart cleared!', cart: [] });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server startup error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port.`);
    } else if (err.code === 'EACCES') {
        console.error(`Permission denied on port ${PORT}. Try running with elevated privileges or a different port.`);
    }
});