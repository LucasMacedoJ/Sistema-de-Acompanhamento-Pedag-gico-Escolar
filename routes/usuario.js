// routes/usuario.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { uploadUsuario } = require('../controllers/fotoController');

// ================================
// 🧾 Formulário de cadastro
// ================================
router.get('/novo', usuarioController.formNovoUsuario);
router.post('/novo', uploadUsuario.single('foto'), usuarioController.cadastrarUsuario);

// ================================
// 📃 Listar usuários (admin)
// ================================
router.get('/lista', usuarioController.listarUsuario);

// ================================
// ✏️ Formulário de edição
// ================================
router.get('/:id/editar', usuarioController.formEditarUsuario);
router.post('/:id/editar', uploadUsuario.single('foto'), usuarioController.atualizarUsuario);

// ================================
// 🗑️ Excluir usuário (POST)
// ================================
router.post('/:id/excluir', usuarioController.excluirUsuario);

// ================================
// 👤 Perfil do usuário logado
// ================================
router.get('/perfil', usuarioController.mostrarPerfil);

module.exports = router;
