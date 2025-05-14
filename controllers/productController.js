// Controller for product collections

const Order = require('../models/orderModel');

const getMenCollection = (req, res) => {
    const menProducts = [
        { id: 1, name: "Men's Jacket", price: 49.99, image: 'men.png' },
        { id: 2, name: "Men's Shoes", price: 79.99, image: 'men.png' },
    ];
    res.json(menProducts);
};

const getWomenCollection = (req, res) => {
    const womenProducts = [
        { id: 1, name: "Women's Dress", price: 59.99, image: 'woman.png' },
        { id: 2, name: "Women's Handbag", price: 89.99, image: 'woman.png' },
    ];
    res.json(womenProducts);
};

const getBestSelling = (req, res) => {
    const bestSellingProducts = [
        { id: 1, name: "Best Selling Jacket", price: 99.99, image: 'men.png' },
        { id: 2, name: "Best Selling Handbag", price: 129.99, image: 'woman.png' },
    ];
    res.json(bestSellingProducts);
};

const placeOrder = async (req, res) => {
    try {
        console.log('Order Request Body:', req.body); // Log the incoming request body
        const { name, address, email, contact, products } = req.body;
        const newOrder = new Order({ name, address, email, contact, products });
        await newOrder.save();
        console.log('Order saved successfully:', newOrder); // Log the saved order
        res.status(201).json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error placing order:', error.message); // Log any errors
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

module.exports = { getMenCollection, getWomenCollection, getBestSelling, placeOrder };
