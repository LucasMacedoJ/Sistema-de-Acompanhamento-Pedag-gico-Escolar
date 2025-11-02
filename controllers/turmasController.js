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

// ➕ Cadastrar nova turma
const cadastrar = async (req, res) => {
  try {
    const { nome, periodo, ano } = req.body; // ✅ Incluído "ano"
    await Turma.create({ nome, periodo, ano });
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao cadastrar turma:', err);
    res.status(500).send('Erro ao cadastrar turma.');
  }
};

// 📋 Listar todas as turmas
const lista = async (req, res) => {
  try {
    const turmas = await Turma.find();
    res.render('turmas/lista', { turmas });
  } catch (err) {
    console.error('Erro ao listar turmas:', err);
    res.status(500).send('Erro ao listar turmas');
  }
};

// 🔍 Detalhes da turma com alunos vinculados
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

//
// ✏️ EDITAR TURMA
//
const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, periodo, ano } = req.body; // ✅ Incluído "ano"

    await Turma.findByIdAndUpdate(id, { nome, periodo, ano });
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao editar turma:', err);
    res.status(500).send('Erro ao editar turma.');
  }
};

//
// ❌ DELETAR TURMA
//
const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: remover vínculo de alunos antes de deletar
    await Aluno.updateMany({ turma: id }, { $unset: { turma: '' } });

    await Turma.findByIdAndDelete(id);
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao deletar turma:', err);
    res.status(500).send('Erro ao deletar turma.');
  }
};

// ✏️ Renderiza o formulário de edição de turma
const editarFormulario = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id).lean();
    if (!turma) return res.status(404).send('Turma não encontrada');
    res.render('turmas/editar', { turma });
  } catch (err) {
    console.error('Erro ao carregar turma para edição:', err);
    res.status(500).send('Erro ao carregar turma.');
  }
};

// Exporta todos os métodos corretamente
module.exports = {
  renderFormularioAluno,
  formularioTurma,
  cadastrar,
  lista,
  detalhesTurma,
  editarFormulario,
  editar,
  deletar
};
