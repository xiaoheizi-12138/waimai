const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { optionalAuth } = require('../middleware/auth');

router.get('/categories', menuController.getCategories);

router.get('/dishes', menuController.getDishes);

router.get('/dishes/:id', menuController.getDishById);

module.exports = router;
