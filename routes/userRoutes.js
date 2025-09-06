const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.post('/', controller.create);
router.get('/', controller.getAll);
// Login debe ir antes de rutas dinámicas para evitar colisión con :id
router.post('/login', controller.login);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
