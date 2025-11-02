const Turma = require('../models/turma');
const Aluno = require('../models/alunos');

// ============================
// Renderiza formulário de aluno com turmas
// ============================
const renderFormularioAluno = async (req, res) => {
  try {
    const turmas = await Turma.find().lean();
    res.render('alunos/formulario', { turmas });
  } catch (err) {
    console.error('Erro ao buscar turmas:', err);
    res.status(500).send('Erro ao carregar turmas.');
  }
};

// ============================
// Renderiza formulário de cadastro de turma
// ============================
const formularioTurma = (req, res) => {
  res.render('turmas/formulario');
};

// ============================
// Cadastrar nova turma
// ============================
const cadastrar = async (req, res) => {
  try {
    const { nome, periodo, ano } = req.body;
    await Turma.create({ nome, periodo, ano });
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao cadastrar turma:', err);
    res.status(500).send('Erro ao cadastrar turma.');
  }
};

// ============================
// Listar todas as turmas
// ============================
const lista = async (req, res) => {
  try {
    const turmas = await Turma.find().lean();
    res.render('turmas/lista', { turmas });
  } catch (err) {
    console.error('Erro ao listar turmas:', err);
    res.status(500).send('Erro ao listar turmas');
  }
};

// ============================
// Detalhes da turma com alunos vinculados (com filtro opcional)
// ============================
const detalhesTurma = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id).lean();
    if (!turma) return res.status(404).send('Turma não encontrada');

    // Buscar apenas alunos ativos da turma e popular a turma
    let alunos = await Aluno.find({ turma: turma._id, ativo: true })
      .populate('turma')
      .lean();

    // Filtro por query string (?q=nome)
    const q = req.query.q;
    if (q) {
      const regex = new RegExp(q, 'i'); // case insensitive
      alunos = alunos.filter(
        a => regex.test(a.nome) || regex.test(a.sobrenome)
      );
    }

    res.render('turmas/detalhes', { turma, alunos, q });
  } catch (err) {
    console.error('Erro ao buscar detalhes da turma:', err);
    res.status(500).send('Erro ao buscar detalhes da turma');
  }
};



// ============================
// Renderiza formulário de edição de turma
// ============================
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

// ============================
// Editar turma
// ============================
const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, periodo, ano } = req.body;
    await Turma.findByIdAndUpdate(id, { nome, periodo, ano });
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao editar turma:', err);
    res.status(500).send('Erro ao editar turma.');
  }
};

// ============================
// Deletar turma
// ============================
const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: remover vínculo de alunos antes de deletar a turma
    await Aluno.updateMany({ turma: id }, { $unset: { turma: '' } });

    await Turma.findByIdAndDelete(id);
    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao deletar turma:', err);
    res.status(500).send('Erro ao deletar turma.');
  }
};

// ============================
// Exporta todos os métodos
// ============================
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
