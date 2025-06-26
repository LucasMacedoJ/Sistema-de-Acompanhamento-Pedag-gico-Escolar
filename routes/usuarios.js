const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioControllers');

router.get('/formulario', usuarioController.formulario);
router.post('/cadastrar', usuarioController.cadastrar);
router.get('/lista', usuarioController.lista);
router.get('/inativo', usuarioController.inativo);
router.get('/editar/:id', usuarioController.editarForm);
router.post('/editar/:id', usuarioController.editar);
router.get('/toggle-ativo/:id', usuarioController.toggleAtivo);
router.get('/search', usuarioController.search);
router.get('/searchInativos', usuarioController.searchInativos);
router.get('/deletar/:id', usuarioController.deletar);
router.get('/detalhes/:id', usuarioController.detalhes);

module.exports = router;