const express = require('express');
const router = express.Router();

const { getMenCollection, getWomenCollection, getBestSelling, placeOrder } = require('../controllers/productController');

// Routes for product collections
router.get('/men', getMenCollection);
router.get('/women', getWomenCollection);
router.get('/best-selling', getBestSelling);
router.post('/order', placeOrder);

module.exports = router;
