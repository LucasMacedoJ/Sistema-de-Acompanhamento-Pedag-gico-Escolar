const Turma = require('../models/turma');
const Aluno = require('../models/alunos');

// Renderiza o formulário de aluno com turmas
const renderFormularioAluno = async (req, res) => {
  try {
    const turmas = await Turma.find();
    res.render('alunos/formulario', { turmas });
  } catch (err) {
    console.error('Erro ao buscar turmas:', err);
    res.status(500).send('Erro ao carregar turmas.');
  }
};

// Renderiza o formulário para cadastrar turma
const formularioTurma = (req, res) => {
  res.render('turmas/formulario');
};

// Cadastra uma nova turma
const cadastrar = async (req, res) => {
   try {
    const { nome, periodo } = req.body;
    console.log(req.body); // debug
    await Turma.create({ nome, periodo });
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao cadastrar turma:', err);
    res.status(500).send('Erro ao cadastrar turma.');
  }
};

// Lista todas as turmas
const lista = async (req, res) => {
  try {
    const turmas = await Turma.find();
    res.render('turmas/lista', { turmas });
  } catch (err) {
    console.error('Erro ao listar turmas:', err);
    res.status(500).send('Erro ao listar turmas');
  }
};

// Detalhes da turma com alunos vinculados
const detalhesTurma = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id).lean();
    if (!turma) return res.status(404).send('Turma não encontrada');
    const alunos = await Aluno.find({ turma: turma._id }).lean();
    res.render('turmas/detalhes', { turma, alunos });
  } catch (err) {
    res.status(500).send('Erro ao buscar detalhes da turma');
  }
};


// Exporta todos os métodos corretamente
module.exports = {
  renderFormularioAluno,
  formularioTurma,
  cadastrar,
  lista,
  detalhesTurma
};
