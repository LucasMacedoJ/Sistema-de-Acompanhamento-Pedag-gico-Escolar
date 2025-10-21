const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Rota GET para exibir o formulário de teste de cadastro
router.get('/', (req, res) => {
  res.render('teste-cadastro', { erro: null });
});

// Rota POST para processar o cadastro de usuário de teste
router.post('/', async (req, res) => {
  try {
    const { email, senha, perfil } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = new Usuario({ email, senha: senhaHash, perfil });
    await usuario.save();
    res.render('teste-cadastro', { erro: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.render('teste-cadastro', { erro: 'Erro ao cadastrar usuário: ' + err.message });
  }
});

module.exports = router;
