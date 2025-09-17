const express = require('express');
const router = express.Router();
const apoiaController = require('../controllers/apoiaController');

// Rota para exibir o formulário de novo apoia
router.get('/novo', apoiaController.novoApoiaForm);

// Rota para criar apoia (POST)
router.post('/novo', apoiaController.criarApoia);

// Rota para listar apoias
router.get('/lista', apoiaController.listaapoias);

// Rota para detalhes de um apoia
router.get('/detalhes/:id', apoiaController.detalhesApoia);

// Rota para atualizar dataFim
router.post('/editarDataFim/:id', apoiaController.editarDataFim);

module.exports = router;
