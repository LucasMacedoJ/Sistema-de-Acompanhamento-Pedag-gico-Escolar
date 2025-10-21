// ...existing code...
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.loginForm = (req, res) => {
  res.render('login', { erro: null });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.render('login', { erro: 'Usuário não encontrado.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.render('login', { erro: 'Senha incorreta.' });

    // Salva dados essenciais na sessão (inclui _id, nome e avatar)
    req.session.usuario = {
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      avatar: usuario.avatar || usuario.foto || null
    };

    req.session.usuarioId = usuario._id;
    return res.redirect('/alunos/');
  } catch (err) {
    console.error('Erro no login:', err);
    return res.render('login', { erro: 'Erro ao fazer login.' });
  }
};
// ...existing code...