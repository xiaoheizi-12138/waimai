const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/orders', authenticate, orderController.create);

router.get('/orders', authenticate, orderController.getUserOrders);

router.get('/orders/:id', authenticate, orderController.getById);

router.get('/admin/orders', authenticate, requireAdmin, orderController.getAllOrders);

router.put('/admin/orders/:id/status', authenticate, requireAdmin, orderController.updateStatus);

module.exports = router;
