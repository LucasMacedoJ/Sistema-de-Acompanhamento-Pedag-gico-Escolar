const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

router.get('/novo', usuarioController.formNovoUsuario);
router.post('/novo', usuarioController.cadastrarUsuario);
router.get('/lista', usuarioController.listarUsuarios);

module.exports = router;