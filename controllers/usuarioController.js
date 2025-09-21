const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

// Exibe formulário de novo usuário
exports.formNovoUsuario = (req, res) => {
  res.render('usuarios/novo', { 
    usuario: req.session.usuario || null, 
    erro: null 
  });
};

// Cadastrar novo usuário
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { email, senha, perfil } = req.body;

    // Verificação de campos obrigatórios
    if (!email || !senha) {
      return res.render('usuarios/novo', { 
        usuario: req.session.usuario || null, 
        erro: 'Preencha todos os campos obrigatórios.' 
      });
    }

    // Define perfil (padrão: comum)
    let perfilFinal = 'comum';
    if (req.session.usuario && req.session.usuario.perfil === 'admin' && perfil === 'admin') {
      perfilFinal = 'admin';
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar e salvar usuário
    const usuario = new Usuario({ email, senha: senhaHash, perfil: perfilFinal });
    await usuario.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('usuarios/novo', { 
      usuario: req.session.usuario || null, 
      erro: 'Erro ao cadastrar usuário. Tente novamente.' 
    });
  }
};

// Listar usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().lean();
    res.render('usuarios/lista', { 
      usuario: req.session.usuario || null, 
      usuarios, 
      erro: null 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao listar usuários.');
  }
};
