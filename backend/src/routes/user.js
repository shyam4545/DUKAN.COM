const express = require('express');
const router = express.Router();

const { addToCart, getCart, updateCartItem, placeOrder, getUserOrders } = require('../controllers/orderController');
const { submitFeedback } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All these routes are for Normal Users only
router.use(authenticate, authorize('USER'));

// Cart
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:id', updateCartItem);

// Orders
router.get('/orders', getUserOrders);
router.post('/orders', placeOrder);

// Feedback
router.post('/feedback', submitFeedback);

module.exports = router;
