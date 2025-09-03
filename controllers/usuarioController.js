const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.formNovoUsuario = (req, res) => {
  res.render('usuarios/novo', { usuario: req.session.usuario, erro: null });
};

exports.cadastrarUsuario = async (req, res) => {
  try {
    const { email, senha, perfil } = req.body;
    let perfilFinal = 'comum';
    // Só admin pode criar outro admin
    if (req.session.usuario && req.session.usuario.perfil === 'admin' && perfil === 'admin') {
      perfilFinal = 'admin';
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = new Usuario({ email, senha: senhaHash, perfil: perfilFinal });
    await usuario.save();
    res.redirect('/login');
  } catch (err) {
    res.render('usuarios/novo', { erro: 'Erro ao cadastrar usuário.' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().lean();
    res.render('usuarios/lista', { usuarios });
  } catch (err) {
    res.status(500).send('Erro ao listar usuários.');
  }
};