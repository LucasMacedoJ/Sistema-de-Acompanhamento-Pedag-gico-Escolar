const Turma = require('../models/turma');
const Aluno = require('../models/alunos');

/* =========================================================
   📌 FORMULÁRIOS
   ========================================================= */

// Renderiza formulário de cadastro de aluno com lista de turmas
const renderFormularioAluno = async (req, res) => {
  try {
    const turmas = await Turma.find().lean();
    res.render('alunos/formulario', { turmas });
  } catch (err) {
    console.error('Erro ao buscar turmas:', err);
    res.status(500).send('Erro ao carregar turmas.');
  }
};

// Renderiza formulário de cadastro de turma
const formularioTurma = (req, res) => {
  res.render('turmas/formulario');
};

/* =========================================================
   📌 CRUD DE TURMAS
   ========================================================= */

// ✅ Criar turma
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

// ✅ Listar turmas
const lista = async (req, res) => {
  try {
    const turmas = await Turma.find().lean();
    res.render('turmas/lista', { turmas });
  } catch (err) {
    console.error('Erro ao listar turmas:', err);
    res.status(500).send('Erro ao listar turmas.');
  }
};

// ✅ Exibir detalhes da turma + alunos vinculados (com filtro opcional)
const detalhesTurma = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id).lean();
    if (!turma) return res.status(404).send('Turma não encontrada.');

    // Buscar somente alunos ativos da turma
    let alunos = await Aluno.find({ turma: turma._id, ativo: true })
      .populate('turma')
      .lean();

    // 🔍 Filtro por nome (?q=nome)
    const q = req.query.q;
    if (q) {
      const regex = new RegExp(q, 'i');
      alunos = alunos.filter(
        a => regex.test(a.nome) || regex.test(a.sobrenome)
      );
    }

    res.render('turmas/detalhes', { turma, alunos, q });
  } catch (err) {
    console.error('Erro ao carregar detalhes da turma:', err);
    res.status(500).send('Erro ao carregar detalhes da turma.');
  }
};

/* =========================================================
   📌 EDIÇÃO DE TURMAS
   ========================================================= */

// Renderizar formulário de edição
const editarFormulario = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id).lean();
    if (!turma) return res.status(404).send('Turma não encontrada.');

    res.render('turmas/editar', { turma });
  } catch (err) {
    console.error('Erro ao carregar turma para edição:', err);
    res.status(500).send('Erro ao carregar turma.');
  }
};

// Editar turma
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

/* =========================================================
   📌 EXCLUSÃO DE TURMAS
   ========================================================= */

const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Limpando vínculo dos alunos antes de excluir
    await Aluno.updateMany({ turma: id }, { $unset: { turma: '' } });

    await Turma.findByIdAndDelete(id);

    res.redirect('/turmas/lista');
  } catch (err) {
    console.error('Erro ao deletar turma:', err);
    res.status(500).send('Erro ao deletar turma.');
  }
};

/* =========================================================
   ✅ EXPORTA OS MÉTODOS
   ========================================================= */

module.exports = {
  renderFormularioAluno,
  formularioTurma,
  cadastrar,
  lista,
  detalhesTurma,
  editarFormulario,
  editar,
  deletar,
};
