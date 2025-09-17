const express = require('express');
const router = express.Router();
const nepreController = require('../controllers/nepreController');

// Rota para exibir o formulário de novo nepre
router.get('/novo', nepreController.novoNepreForm);

// Rota para criar nepre (POST)
router.post('/novo', nepreController.criarNepre);

// Rota para listar nepres
router.get('/lista', nepreController.listanepres);

// Rota para detalhes de um nepre
router.get('/detalhes/:id', nepreController.detalhesNepre);

// Rota para atualizar dataFim
router.post('/editarDataFim/:id', nepreController.editarDataFim);

module.exports = router;
