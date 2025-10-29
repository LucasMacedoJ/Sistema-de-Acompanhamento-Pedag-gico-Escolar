// routes/ocorrncias.js
const express = require('express');
const router = express.Router();
const ocorrenciasController = require('../controllers/ocorrenciasControllers');

router.get('/nova', ocorrenciasController.nova);
router.post('/cadastrar', ocorrenciasController.cadastrar);
router.get('/lista', ocorrenciasController.listaOcorrencias);
router.get('/detalhes/:id', ocorrenciasController.detalhesOcorrencia);
router.get('/editar/:id', ocorrenciasController.formEditar);
router.post('/editar/:id', ocorrenciasController.atualizar);


module.exports = router;