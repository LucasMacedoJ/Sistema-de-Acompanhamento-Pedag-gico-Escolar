const Apoia = require('../models/apoia');

// Formulário para criar apoio
exports.novoApoiaForm = (req, res) => {
  const alunoId = req.query.aluno;
  res.render('apoia/novoApoia', { alunoId });
};

// Criar apoio
exports.criarApoia = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const { descricao, dataInicio, dataFim } = req.body;

    const novoApoio = new Apoia({
      aluno: alunoId,
      descricao,
      dataInicio,
      dataFim
    });

    await novoApoio.save();
    res.redirect(`/alunos/detalhes/${alunoId}`);
  } catch (err) {
    res.status(500).send('Erro ao salvar apoio: ' + err);
  }
};

// Listar apoios
exports.listaApoios = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const apoios = await Apoia.find({ aluno: alunoId }).populate('aluno').lean();
    res.render('apoia/listaApoia', { apoios, alunoId });
  } catch (err) {
    res.status(500).send('Erro ao buscar apoios: ' + err);
  }
};
