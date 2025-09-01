const Apoia = require('../models/apoia'); // Crie esse model se ainda não existir

// Exibe o formulário de novo apoio
exports.novoApoiaForm = (req, res) => {
  const alunoId = req.query.aluno;
  res.render('apoia/novoApoia', { alunoId });
};

// Salva o apoio no banco
exports.criarApoia = async (req, res) => {
  try {
    const alunoId = req.query.aluno;
    const { descricao, data } = req.body;
    const novoApoio = new Apoia({
      aluno: alunoId,
      descricao,
      data
    });
    await novoApoio.save();
    res.redirect(`/alunos/detalhes/${alunoId}`);
  } catch (err) {
    res.status(500).send('Erro ao salvar apoio: ' + err);
  }
};