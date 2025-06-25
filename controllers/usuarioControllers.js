const Usuario = require('../models/usuario');

exports.formulario = (req, res) => {
  res.render('usuarios/formulario');
};

exports.cadastrar = async (req, res) => {
  try {
    const novoUsuario = new Usuario({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      idade: req.body.idade,
      pais: req.body.pais
    });
    await novoUsuario.save();
    res.render("usuarios/SUCESSO", { usuario: novoUsuario });
  } catch (err) {
    res.send("erro ao salvar o usuario:" + err);
  }
};

exports.lista = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ ativo: true }).lean();
    res.render('usuarios/lista', { usuarios });
  } catch (err) {
    res.send("Erro ao listar usuários: " + err);
  }
};

exports.inativo = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ ativo: false }).lean();
    res.render('usuarios/inativo', { usuarios });
  } catch (err) {
    res.send("Erro ao listar usuários inativos: " + err);
  }
};

exports.editarForm = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).lean();
    if (!usuario) return res.status(404).send("usuario não encontrado");
    res.render('usuarios/editar', { usuario });
  } catch (err) {
    res.send("Erro ao buscar usuário: " + err);
  }
};

exports.editar = async (req, res) => {
  try {
    await Usuario.findByIdAndUpdate(req.params.id, {
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      idade: req.body.idade,
      pais: req.body.pais
    });
    res.redirect('/usuarios/lista');
  } catch (err) {
    res.send("Erro ao editar usuário: " + err);
  }
};

exports.toggleAtivo = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).send("Usuário não encontrado");
    usuario.ativo = !usuario.ativo;
    await usuario.save();
    res.redirect('/usuarios/lista');
  } catch (err) {
    res.send("Erro ao alterar status: " + err);
  }
};

exports.search = async (req, res) => {
  const query = req.query.q;
  try {
    const usuarios = await Usuario.find({
      ativo: true,
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.render('usuarios/lista', { usuarios });
  } catch (err) {
    res.send("Erro ao buscar usuários: " + err);
  }
};

exports.searchInativos = async (req, res) => {
  const query = req.query.q;
  try {
    const usuarios = await Usuario.find({
      ativo: false,
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.render('usuarios/inativo', { usuarios });
  } catch (err) {
    res.send("Erro ao buscar usuários inativos: " + err);
  }
};
exports.deletar = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.redirect('/usuarios/lista');
  } catch (err) {
    res.send("Erro ao deletar usuário: " + err);
  }
}                   