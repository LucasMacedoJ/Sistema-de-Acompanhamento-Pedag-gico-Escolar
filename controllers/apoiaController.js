const Apoia = require('../models/apoia');

// Formulário para criar apoia
exports.novoApoiaForm = (req, res) => {
  const alunoId = req.query.aluno;
  res.render('apoia/novoApoia', { alunoId });
};

// Criar apoia
exports.criarApoia = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const { descricao, dataInicio, dataFim } = req.body;

    // Garante que está convertendo corretamente
    const inicio = dataInicio ? new Date(dataInicio + "T00:00:00") : null;
    const fim = dataFim ? new Date(dataFim + "T00:00:00") : null;

    if (!inicio) {
      return res.status(400).send('Data de início é obrigatória.');
    }

    const novoapoia = new Apoia({
      aluno: alunoId,
      descricao,
      dataInicio: inicio,
      dataFim: fim
    });

    await novoapoia.save();
    res.redirect(`/alunos/detalhes/${alunoId}`);
  } catch (err) {
    res.status(500).send('Erro ao salvar apoia: ' + err);
  }
};


// Listar apoias
exports.listaapoias = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const apoias = await Apoia.find({ aluno: alunoId }).populate('aluno').lean();
    res.render('apoia/listaApoia', { apoias, alunoId });
  } catch (err) {
    res.status(500).send('Erro ao buscar apoias: ' + err);
  }
};

// Detalhes de um apoia
exports.detalhesApoia = async (req, res) => {
  try {
    const apoia = await Apoia.findById(req.params.id).populate('aluno').lean();
    if (!apoia) {
      return res.status(404).send('apoia não encontrado');
    }
    res.render('apoia/detalhesApoia', { apoia });
  } catch (err) {
    res.status(500).send('Erro ao buscar detalhes do apoia: ' + err);
  }
};

const apoia = require('../models/apoia');

exports.editarDataFim = async (req, res) => {
  const apoiaId = req.params.id;
  const { dataFim } = req.body;

  try {
    await apoia.findByIdAndUpdate(apoiaId, { dataFim: dataFim ? new Date(dataFim) : null });
    res.redirect(`/apoia/detalhes/${apoiaId}`);
  } catch (err) {
    console.error(err);
    res.send('Erro ao atualizar a data de fim.');
  }
};
