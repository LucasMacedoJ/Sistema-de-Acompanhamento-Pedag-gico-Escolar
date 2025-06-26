const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/ocorrenciasControllers');

router.get('/nova', ocorenciasController.nova);
router.post('/cadastrar', ocorenciasController.cadastrar);

module.exports = router;