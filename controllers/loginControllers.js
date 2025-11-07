// ==========================================
// 📌 Controller de Usuários – Login
// ==========================================

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

/* =========================================================
   📌 Formulário de Login
   ========================================================= */
exports.loginForm = (req, res) => {
  res.render('login', { erro: null });
};

/* =========================================================
   📌 Realiza Login
   ========================================================= */
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Buscar usuário
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.render('login', { erro: 'Usuário não encontrado.' });
    }

    // Validar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.render('login', { erro: 'Senha incorreta.' });
    }

    // Criar sessão com dados essenciais
    req.session.usuario = {
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      foto: usuario.foto || null
    };

    req.session.usuarioId = usuario._id;

    // Redirecionar após login
    return res.redirect('/alunos/');

  } catch (err) {
    console.error('Erro no login:', err);
    return res.render('login', { erro: 'Erro ao fazer login.' });
  }
};
