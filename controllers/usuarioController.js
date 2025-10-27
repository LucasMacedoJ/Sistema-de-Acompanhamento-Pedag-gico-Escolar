// controllers/usuarioController.js
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { uploadUsuario, processarFoto, removerFoto } = require('./fotoController');

// ====================================
// 🔒 Funções auxiliares
// ====================================
function isAdmin(req) {
  return req.session?.usuario?.perfil === 'admin';
}

function isSelf(req, id) {
  return String(req.session?.usuario?._id) === String(id);
}

async function validarEmail(email, idExcluido = null) {
  if (!email?.trim()) return 'Email é obrigatório.';

  const existente = await Usuario.findOne({ email: email.trim() });
  if (existente && String(existente._id) !== String(idExcluido)) return 'Email já cadastrado.';

  return null;
}

// ====================================
// 🧾 Formulário de cadastro
// ====================================
exports.formNovoUsuario = (req, res) => {
  res.render('usuario/novo', {
    usuario: req.session.usuario || null,
    erro: null,
    form: {}
  });
};

// ====================================
// 🧩 Cadastrar novo usuário
// ====================================
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!email?.trim() || !senha?.trim()) {
      return res.render('usuario/novo', {
        usuario: req.session.usuario || null,
        erro: 'Preencha todos os campos obrigatórios.',
        form: { nome, email, perfil }
      });
    }

    const erroEmail = await validarEmail(email);
    if (erroEmail) {
      return res.render('usuario/novo', {
        usuario: req.session.usuario || null,
        erro: erroEmail,
        form: { nome, email, perfil }
      });
    }

    const perfilFinal = (isAdmin(req) && perfil === 'admin') ? 'admin' : 'comum';
    const senhaHash = await bcrypt.hash(senha, 10);

    let fotoPath = null;
    if (req.file) {
      fotoPath = await processarFoto(req.file, 'usuario');
    }

    const usuario = new Usuario({
      nome: nome?.trim() || '',
      email: email.trim(),
      senha: senhaHash,
      perfil: perfilFinal,
      foto: fotoPath
    });

    await usuario.save();

    return isAdmin(req) ? res.redirect('/usuario/lista') : res.redirect('/login');

  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.render('usuario/novo', {
      usuario: req.session.usuario || null,
      erro: 'Erro ao cadastrar usuário. Tente novamente.',
      form: req.body
    });
  }
};

// ====================================
// 📃 Listar usuários (somente admin)
// ====================================
exports.listarUsuario = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.redirect('/erro');

    const usuarios = await Usuario.find({}, '_id nome email perfil foto').lean();

    // Ajusta caminho das fotos
    usuarios.forEach(usuarioItem => {
      if (usuarioItem.foto && !usuarioItem.foto.startsWith('/')) {
        usuarioItem.foto = `/uploads/usuario/${usuarioItem.foto}`;
      }
    });

    res.render('usuario/lista', {
      usuarioLogado: req.session.usuario || null,
      usuario: usuarios,
      erro: null
    });

  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).send('Erro ao listar usuários.');
  }
};

// ====================================
// ✏️ Formulário de edição
// ====================================
exports.formEditarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.session.usuario) return res.redirect('/login');
    if (!isAdmin(req) && !isSelf(req, id)) return res.redirect('/erro');

    const usuarioEdit = await Usuario.findById(id).lean();
    if (!usuarioEdit) return res.redirect(isAdmin(req) ? '/usuario/lista' : '/usuario/perfil');

    if (usuarioEdit.foto && !usuarioEdit.foto.startsWith('/')) {
      usuarioEdit.foto = `/uploads/usuario/${usuarioEdit.foto}`;
    }

    res.render('usuario/editar', {
      usuario: req.session.usuario || null,
      usuarioEdit,
      erro: null
    });

  } catch (err) {
    console.error(err);
    res.redirect('/usuario/lista');
  }
};

// ====================================
// 🔄 Atualizar usuário
// ====================================
exports.atualizarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.session.usuario) return res.redirect('/login');
    if (!isAdmin(req) && !isSelf(req, id)) return res.redirect('/erro');

    const { nome, email, senha, perfil } = req.body;
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.redirect('/usuario/lista');

    const erroEmail = await validarEmail(email, id);
    if (erroEmail) {
      return res.render('usuario/editar', {
        usuario: req.session.usuario || null,
        usuarioEdit: Object.assign(usuario.toObject(), { nome, email, perfil }),
        erro: erroEmail
      });
    }

    usuario.nome = nome?.trim() || usuario.nome;
    usuario.email = email.trim();
    if (isAdmin(req) && perfil) usuario.perfil = perfil;
    if (senha?.trim()) usuario.senha = await bcrypt.hash(senha, 10);
    if (req.file) usuario.foto = await processarFoto(req.file, 'usuario');

    await usuario.save();

    if (isSelf(req, id)) {
      Object.assign(req.session.usuario, {
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        foto: usuario.foto
      });
    }

    return isAdmin(req) ? res.redirect('/usuario/lista') : res.redirect('/usuario/perfil');

  } catch (err) {
    console.error(err);
    res.render('usuario/editar', {
      usuario: req.session.usuario || null,
      usuarioEdit: Object.assign({}, req.body, { _id: req.params.id }),
      erro: 'Erro ao atualizar usuário.'
    });
  }
};

// ====================================
// 🗑️ Excluir usuário (admin)
// ====================================
exports.excluirUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isAdmin(req)) return res.redirect('/erro');
    if (isSelf(req, id)) return res.redirect('/usuario/lista');

    const usuarioRemovido = await Usuario.findByIdAndDelete(id);
    if (usuarioRemovido?.foto) {
      await removerFoto(usuarioRemovido.foto);
    }

    res.redirect('/usuario/lista');

  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.redirect('/usuario/lista');
  }
};

// ====================================
// 👤 Mostrar perfil do usuário
// ====================================
exports.mostrarPerfil = async (req, res) => {
  try {
    if (!req.session.usuario) return res.redirect('/login');

    const usuarioPerfil = await Usuario.findById(req.session.usuario._id).lean();
    if (!usuarioPerfil) return res.redirect('/login');

    if (usuarioPerfil.foto && !usuarioPerfil.foto.startsWith('/')) {
      usuarioPerfil.foto = `/uploads/usuario/${usuarioPerfil.foto}`;
    }

    res.render('usuario/perfil', {
      usuario: req.session.usuario || null,
      usuarioPerfil
    });

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};
