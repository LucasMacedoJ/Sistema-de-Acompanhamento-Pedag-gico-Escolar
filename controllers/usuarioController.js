// controllers/usuariosController.js
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { upload, processarFoto, removerFoto } = require('./fotoController');

// ====================================
// 🔒 Funções auxiliares
// ====================================
function isAdmin(req) {
  return req.session?.usuario?.perfil === 'admin';
}

function isSelf(req, id) {
  return String(req.session?.usuario?._id) === String(id);
}

// ====================================
// 🧾 Formulário de cadastro
// ====================================
exports.formNovoUsuario = (req, res) => {
  res.render('usuarios/novo', {
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

    if (!email || !senha) {
      return res.render('usuarios/novo', {
        usuario: req.session.usuario || null,
        erro: 'Preencha todos os campos obrigatórios.',
        form: { nome, email, perfil }
      });
    }

    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.render('usuarios/novo', {
        usuario: req.session.usuario || null,
        erro: 'Email já cadastrado.',
        form: { nome, email, perfil }
      });
    }

    const perfilFinal = isAdmin(req) && perfil === 'admin' ? 'admin' : 'comum';
    const senhaHash = await bcrypt.hash(senha, 10);

    let fotoPath = null;
    if (req.file) {
      fotoPath = await processarFoto(req.file, 'usuarios');
    }

    const usuario = new Usuario({ nome: nome || '', email, senha: senhaHash, perfil: perfilFinal, foto: fotoPath });
    await usuario.save();

    if (isAdmin(req)) return res.redirect('/usuarios/lista');
    return res.redirect('/login');

  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.render('usuarios/novo', {
      usuario: req.session.usuario || null,
      erro: 'Erro ao cadastrar usuário. Tente novamente.',
      form: req.body
    });
  }
};

// ====================================
// 📃 Listar usuários (somente admin)
// ====================================
exports.listarUsuarios = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.redirect('/erro');
    const usuarios = await Usuario.find({}, '_id nome email perfil foto').lean();
    res.render('usuarios/lista', { usuario: req.session.usuario || null, usuarios, erro: null });
  } catch (err) {
    console.error(err);
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
    if (!usuarioEdit) return res.redirect(isAdmin(req) ? '/usuarios/lista' : '/usuarios/perfil');

    res.render('usuarios/editar', { usuario: req.session.usuario || null, usuarioEdit, erro: null });

  } catch (err) {
    console.error(err);
    res.redirect('/usuarios/lista');
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
    if (!usuario) return res.redirect('/usuarios/lista');

    if (!email) {
      return res.render('usuarios/editar', {
        usuario: req.session.usuario || null,
        usuarioEdit: Object.assign(usuario.toObject(), { nome, email, perfil }),
        erro: 'Email é obrigatório.'
      });
    }

    if (usuario.email !== email) {
      const existe = await Usuario.findOne({ email });
      if (existe) {
        return res.render('usuarios/editar', {
          usuario: req.session.usuario || null,
          usuarioEdit: Object.assign(usuario.toObject(), { nome, email, perfil }),
          erro: 'Email já em uso por outro usuário.'
        });
      }
    }

    usuario.nome = nome || usuario.nome;
    usuario.email = email;
    if (isAdmin(req) && perfil) usuario.perfil = perfil;
    if (senha?.trim()) usuario.senha = await bcrypt.hash(senha, 10);
    if (req.file) usuario.foto = await processarFoto(req.file, 'usuarios');

    await usuario.save();

    if (isSelf(req, id)) {
      Object.assign(req.session.usuario, { nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, foto: usuario.foto });
    }

    return isAdmin(req) ? res.redirect('/usuarios/lista') : res.redirect('/usuarios/perfil');

  } catch (err) {
    console.error(err);
    res.render('usuarios/editar', {
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
    if (String(req.session.usuario._id) === String(id)) return res.redirect('/usuarios/lista');

    await Usuario.deleteOne({ _id: id });
    res.redirect('/usuarios/lista');

  } catch (err) {
    console.error(err);
    res.redirect('/usuarios/lista');
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

    res.render('usuarios/perfil', { usuario: req.session.usuario || null, usuarioPerfil });

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};
