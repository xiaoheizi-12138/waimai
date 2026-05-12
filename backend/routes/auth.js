const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/wx/login', authController.wxLogin);

router.get('/user/info', authenticate, authController.getUserInfo);

module.exports = router;
