const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  getStores,
  getStoreById,
  createStore,
  deleteStore,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, createUserSchema, createStoreSchema } = require('../validators/schemas');

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.post('/users', validate(createUserSchema), createUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.get('/stores', getStores);
router.get('/stores/:id', getStoreById);
router.post('/stores', validate(createStoreSchema), createStore);
router.delete('/stores/:id', deleteStore);

module.exports = router;
