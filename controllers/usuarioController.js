const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const avatarBasePath = '/uploads/avatars/';
const publicDir = path.join(__dirname, '..', 'public');

function removeFileIfExists(relPath) {
  if (!relPath) return;
  const clean = relPath.replace(/^\//, '');
  const full = path.join(publicDir, clean);
  try {
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) {
    console.error('Erro ao remover arquivo:', full, e);
  }
}

function isAdmin(req) {
  return req.session && req.session.usuario && req.session.usuario.perfil === 'admin';
}

function isSelf(req, id) {
  return req.session && req.session.usuario && String(req.session.usuario._id) === String(id);
}

// Exibe formulário de novo usuário
exports.formNovoUsuario = (req, res) => {
  res.render('usuarios/novo', {
    usuario: req.session.usuario || null,
    erro: null,
    form: {}
  });
};

// Cadastrar novo usuário
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

    let perfilFinal = 'comum';
    if (isAdmin(req) && perfil === 'admin') perfilFinal = 'admin';

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuarioObj = {
      nome: nome || '',
      email,
      senha: senhaHash,
      perfil: perfilFinal
    };

    if (req.file && req.file.filename) {
      usuarioObj.avatar = `${avatarBasePath}${req.file.filename}`;
    }

    const usuario = new Usuario(usuarioObj);
    await usuario.save();

    if (isAdmin(req)) return res.redirect('/usuarios/lista');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('usuarios/novo', {
      usuario: req.session.usuario || null,
      erro: 'Erro ao cadastrar usuário. Tente novamente.',
      form: req.body
    });
  }
};

// Listar usuários (apenas admin)
exports.listarUsuarios = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.redirect('/erro');
    const usuarios = await Usuario.find({}, '_id nome email perfil avatar').lean();
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

// Formulário de edição de usuário
exports.formEditarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.session.usuario) return res.redirect('/login');
    if (!isAdmin(req) && !isSelf(req, id)) return res.redirect('/erro');

    const usuarioEdit = await Usuario.findById(id).lean();
    if (!usuarioEdit) return res.redirect(isAdmin(req) ? '/usuarios/lista' : '/usuarios/perfil');

    res.render('usuarios/editar', {
      usuario: req.session.usuario || null,
      usuarioEdit,
      erro: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/usuarios/lista');
  }
};

// Atualizar usuário
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

    if (isAdmin(req) && perfil) {
      usuario.perfil = perfil;
    }

    if (senha && senha.trim() !== '') {
      usuario.senha = await bcrypt.hash(senha, 10);
    }

    if (req.file && req.file.filename) {
      if (usuario.avatar) removeFileIfExists(usuario.avatar);
      usuario.avatar = `${avatarBasePath}${req.file.filename}`;
    }

    await usuario.save();

    if (isSelf(req, id)) {
      req.session.usuario.nome = usuario.nome;
      req.session.usuario.email = usuario.email;
      req.session.usuario.avatar = usuario.avatar;
      req.session.usuario.perfil = usuario.perfil;
    }

    if (isAdmin(req)) return res.redirect('/usuarios/lista');
    return res.redirect('/usuarios/perfil');
  } catch (err) {
    console.error(err);
    res.render('usuarios/editar', {
      usuario: req.session.usuario || null,
      usuarioEdit: Object.assign({}, req.body, { _id: req.params.id }),
      erro: 'Erro ao atualizar usuário.'
    });
  }
};

// Excluir usuário (apenas admin)
exports.excluirUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isAdmin(req)) return res.redirect('/erro');

    if (String(req.session.usuario._id) === String(id)) {
      return res.redirect('/usuarios/lista');
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.redirect('/usuarios/lista');

    if (usuario.avatar) removeFileIfExists(usuario.avatar);

    await Usuario.deleteOne({ _id: id });
    res.redirect('/usuarios/lista');
  } catch (err) {
    console.error(err);
    res.redirect('/usuarios/lista');
  }
};

// Mostrar perfil (usuário autenticado)
exports.mostrarPerfil = async (req, res) => {
  try {
    if (!req.session.usuario) return res.redirect('/login');
    const usuarioPerfil = await Usuario.findById(req.session.usuario._id).lean();
    if (!usuarioPerfil) return res.redirect('/login');
    res.render('usuarios/perfil', {
      usuario: req.session.usuario || null,
      usuarioPerfil
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// Upload de avatar (req.file vindo de multer, field name: 'avatar')
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) return res.redirect('/login');
    const user = await Usuario.findById(req.session.usuario._id);
    if (!user) return res.redirect('/login');

    if (req.file && req.file.filename) {
      if (user.avatar) removeFileIfExists(user.avatar);
      user.avatar = `${avatarBasePath}${req.file.filename}`;
      await user.save();
      req.session.usuario.avatar = user.avatar;
    }
    res.redirect('/usuarios/perfil');
  } catch (err) {
    console.error(err);
    res.redirect('/usuarios/perfil');
  }
};

// Remover avatar
exports.removerAvatar = async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) return res.redirect('/login');
    const user = await Usuario.findById(req.session.usuario._id);
    if (!user) return res.redirect('/login');

    if (user.avatar) {
      removeFileIfExists(user.avatar);
      user.avatar = undefined;
      await user.save();
      req.session.usuario.avatar = user.avatar;
    }
    res.redirect('/usuarios/perfil');
  } catch (err) {
    console.error(err);
    res.redirect('/usuarios/perfil');
  }
};