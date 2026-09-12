const express = require('express');
const router = express.Router();

const { getDashboard } = require('../controllers/ownerController');
const { getOwnerProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getOwnerOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up storage for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Owner dashboard — STORE_OWNER role only
router.get('/dashboard', authenticate, authorize('STORE_OWNER'), getDashboard);

// Products
router.get('/products', authenticate, authorize('STORE_OWNER'), getOwnerProducts);
router.post('/products', authenticate, authorize('STORE_OWNER'), upload.single('image'), createProduct);
router.put('/products/:id', authenticate, authorize('STORE_OWNER'), upload.single('image'), updateProduct);
router.delete('/products/:id', authenticate, authorize('STORE_OWNER'), deleteProduct);

// Orders
router.get('/orders', authenticate, authorize('STORE_OWNER'), getOwnerOrders);
router.put('/orders/:id/status', authenticate, authorize('STORE_OWNER'), updateOrderStatus);

module.exports = router;
