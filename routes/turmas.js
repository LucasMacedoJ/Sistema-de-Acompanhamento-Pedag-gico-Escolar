const express = require('express');
const router = express.Router();
const turmasController = require('../controllers/turmasController');

router.get('/formulario', turmasController.formularioTurma);
router.post('/cadastrar', turmasController.cadastrar);
router.get('/lista', turmasController.lista);

module.exports = router;
 