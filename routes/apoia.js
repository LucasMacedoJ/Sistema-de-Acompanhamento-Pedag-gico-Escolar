const express = require('express');
const router = express.Router();
const apoiaController = require('../controllers/apoiaController');

router.get('/nova', apoiaController.novoApoiaForm);
router.post('/nova', apoiaController.criarApoia);
router.get('/lista', apoiaController.listaApoios);

module.exports = router;
