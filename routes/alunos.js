const express = require('express');
const router = express.Router();
const alunosController = require('../controllers/alunosControllers');

router.get('/formulario', alunosController.formulario);
router.post('/cadastrar', alunosController.cadastrar);
router.get('/', alunosController.lista); // Corrigido aqui
router.get('/inativo', alunosController.inativo);
router.get('/editar/:id', alunosController.editarForm);
router.post('/editar/:id', alunosController.editar);
router.get('/toggle-ativo/:id', alunosController.toggleAtivo);
router.get('/search', alunosController.search);
router.get('/searchInativos', alunosController.searchInativos);
router.get('/deletar/:id', alunosController.deletar);
router.get('/detalhes/:id', alunosController.detalhes);

module.exports = router;