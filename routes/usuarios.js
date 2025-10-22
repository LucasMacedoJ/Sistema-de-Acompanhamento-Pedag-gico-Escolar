const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { uploadUsuarios } = require('../controllers/fotoController'); // usa upload específico

// Formulário de novo usuário
router.get('/novo', usuarioController.formNovoUsuario);

// Cadastrar usuário com foto
router.post('/novo', uploadUsuarios.single('foto'), usuarioController.cadastrarUsuario);

// Listar usuários (admin)
router.get('/lista', usuarioController.listarUsuarios);

// Formulário de edição
router.get('/:id/editar', usuarioController.formEditarUsuario);

// Atualizar usuário com foto
router.post('/:id/editar', uploadUsuarios.single('foto'), usuarioController.atualizarUsuario);

// Excluir usuário
router.get('/:id/excluir', usuarioController.excluirUsuario);

// Perfil do usuário
router.get('/perfil', usuarioController.mostrarPerfil);

module.exports = router;
