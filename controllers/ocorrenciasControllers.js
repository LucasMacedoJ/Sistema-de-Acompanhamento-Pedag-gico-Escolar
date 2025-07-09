const Ocorrencia = require('../models/ocorrencias');

// Exibe o formulário de nova ocorrência
exports.nova = (req, res) => {
  res.render('ocorrencias/nova', {alunoId: req.query.aluno});
};

// Cadastra uma nova ocorrência
exports.cadastrar = async (req, res) => {
  try {
    const novaOcorrencia = new Ocorrencia({
      // ajuste os campos conforme seu schema de ocorrência
      aluno: req.body.aluno,  // se houver relação com aluno
      descricao: req.body.descricao,
      data: req.body.data,  // se houver relação com aluno
    });
    await novaOcorrencia.save();
    res.render("ocorrencias/SUCESSO", { Ocorrencia: novaOcorrencia });
  } catch (err) {
    res.send("erro ao salvar a Ocorrencia: " + err);
  }

  
};

// Exemplo de controller para listar ocorrências de um aluno
exports.listaOcorrencias = async (req, res) => {
  const alunoId = req.query.aluno;
  let aluno = null;
  let ocorrencias = [];

  if (alunoId) {
    aluno = await Aluno.findById(alunoId).lean();
    ocorrencias = await Ocorrencia.find({ aluno: alunoId }).populate('aluno').lean();
  } else {
    ocorrencias = await Ocorrencia.find().populate('aluno').lean();
  }

  res.render('ocorrencias/listaOcorrencias', { ocorrencias, aluno });
};

exports.detalhesOcorrencia = async (req, res) => {
  const ocorrenciaId = req.params.id;
  try {
    const ocorrencia = await Ocorrencia.findById(ocorrenciaId).populate('aluno').lean();
    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }
    res.render('ocorrencias/detalesOcorrencias', { ocorrencia, aluno: ocorrencia.aluno });
  } catch (err) {
    res.status(500).send("Erro ao buscar ocorrência: " + err);
  }
}