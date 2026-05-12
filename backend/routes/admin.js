const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const dishController = require('../controllers/dishController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);
router.use(requireAdmin);

router.get('/categories', categoryController.getAll);
router.get('/categories/:id', categoryController.getById);
router.post('/categories', categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.remove);

router.get('/dishes', dishController.getAll);
router.get('/dishes/:id', dishController.getById);
router.post('/dishes', dishController.create);
router.put('/dishes/:id', dishController.update);
router.delete('/dishes/:id', dishController.remove);

router.post('/menu/publish', dishController.publishMenu);

module.exports = router;
