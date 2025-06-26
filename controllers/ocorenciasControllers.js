const Ocorencia = require('../models/ocorencias');

exports.formulario = (req, res) => {
  res.render('ocorencias/nova');
};

exports.cadastrar = async (req, res) => {
  try {
    const novoOcorencia = new Ocorencia({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      idade: req.body.idade,
      pais: req.body.pais
    });
    await novoOcorencia.save();
    res.render("Ocorencias/SUCESSO", { Ocorencia: novoOcorencia });
  } catch (err) {
    res.send("erro ao salvar o Ocorencia:" + err);
  }
};