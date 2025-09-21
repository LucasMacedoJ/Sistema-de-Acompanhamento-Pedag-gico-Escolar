const Nepre = require('../models/nepre');

// Formulário para criar nepre
exports.novoNepreForm = (req, res) => {
  const alunoId = req.query.aluno;
  res.render('nepre/novo', { alunoId });
};

// Criar nepre
exports.criarNepre = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const { descricao, dataInicio, dataFim } = req.body;

    // Garante que está convertendo corretamente
    const inicio = dataInicio ? new Date(dataInicio + "T00:00:00") : null;
    const fim = dataFim ? new Date(dataFim + "T00:00:00") : null;

    if (!inicio) {
      return res.status(400).send('Data de início é obrigatória.');
    }

    const novonepre = new Nepre({
      aluno: alunoId,
      descricao,
      dataInicio: inicio,
      dataFim: fim
    });

    await novonepre.save();
    res.redirect(`/alunos/detalhes/${alunoId}`);
  } catch (err) {
    res.status(500).send('Erro ao salvar nepre: ' + err);
  }
};


// Listar nepres
exports.listanepres = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const nepres = await Nepre.find({ aluno: alunoId }).populate('aluno').lean();
    res.render('nepre/lista', { nepres, alunoId });
  } catch (err) {
    res.status(500).send('Erro ao buscar nepres: ' + err);
  }
};

// Detalhes de um nepre
exports.detalhesNepre = async (req, res) => {
  try {
    const nepre = await Nepre.findById(req.params.id).populate('aluno').lean();
    if (!nepre) {
      return res.status(404).send('nepre não encontrado');
    }
    res.render('nepre/detalhes', { nepre });
  } catch (err) {
    res.status(500).send('Erro ao buscar detalhes do nepre: ' + err);
  }
};

const nepre = require('../models/nepre');

exports.editarDataFim = async (req, res) => {
  const nepreId = req.params.id;
  const { dataFim } = req.body;

  try {
    await nepre.findByIdAndUpdate(nepreId, { dataFim: dataFim ? new Date(dataFim) : null });
    res.redirect(`/nepre/detalhes/${nepreId}`);
  } catch (err) {
    console.error(err);
    res.send('Erro ao atualizar a data de fim.');
  }
};
