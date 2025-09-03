const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.loginForm = (req, res) => {
  res.render('login', { erro: null }); // Sempre passa erro
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.render('login', { erro: 'Usuário não encontrado.' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.render('login', { erro: 'Senha incorreta.' });
    }
    // Autenticação OK, salva perfil na sessão
    req.session.usuarioId = usuario._id;
    req.session.usuario = { email: usuario.email, perfil: usuario.perfil };
    res.redirect('/alunos/'); // Corrigido aqui
  } catch (err) {
    res.render('login', { erro: 'Erro ao fazer login.' });
  }
};