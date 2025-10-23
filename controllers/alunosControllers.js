const Aluno = require('../models/alunos');
const Turma = require('../models/turma');
const { uploadAlunos, processarFoto, removerFoto } = require('./fotoController');

// =============================
// 📋 FORMULÁRIO DE CADASTRO
// =============================
exports.formulario = async (req, res) => {
  try {
    const turmas = await Turma.find();
    res.render('alunos/formulario', { turmas });
  } catch (err) {
    console.error('Erro ao carregar turmas:', err);
    res.status(500).send('Erro ao carregar formulário.');
  }
};

// =============================
// 🧩 CADASTRAR ALUNO
// =============================
exports.cadastrar = async (req, res) => {
  try {
    let fotoPath = null;
    if (req.file) {
      fotoPath = await processarFoto(req.file, 'alunos');
    }

    const novoAluno = new Aluno({
      nome: req.body.nome || '', // Nome completo
      dataN: req.body.dataN,
      turma: req.body.turma,
      necessidadeE: req.body.necessidadeE || 'Nenhuma',
      problemaSaude: req.body.problemaSaude || 'Nenhum',
      disciplinaD: req.body.disciplinaD || 'Nenhuma',
      transferenciaOnde: req.body.transferenciaOnde || '',
      transferenciaD: req.body.transferenciaD || '',
      responsavelNome: req.body.responsavelNome || '',
      responsavelContato: req.body.responsavelContato || '',
      segundoProfessor: req.body.segundoProfessor === "on",
      segundoProfessorNome: req.body.segundoProfessorNome || '',
      observacao: req.body.observacao || '',
      foto: fotoPath
    });

    await novoAluno.save();
    res.redirect('/alunos');
  } catch (err) {
    console.error("Erro ao salvar o aluno:", err);
    if (err.name === 'ValidationError') {
      res.status(400).send("Erro de validação: " + err.message);
    } else {
      res.status(500).send("Erro ao salvar o aluno: " + err.message);
    }
  }
};

// =============================
// 📃 LISTAR ATIVOS
// =============================
exports.lista = async (req, res) => {
  try {
    const alunos = await Aluno.find({ ativo: true }).populate('turma').lean();
    res.render('alunos/lista', { alunos });
  } catch (err) {
    res.status(500).send("Erro ao listar alunos: " + err.message);
  }
};

// =============================
// 💤 LISTAR INATIVOS
// =============================
exports.inativo = async (req, res) => {
  try {
    const alunosInativos = await Aluno.find({ ativo: false }).populate('turma').lean();
    res.render('alunos/inativo', { alunos: alunosInativos });
  } catch (err) {
    res.status(500).send("Erro ao listar alunos inativos: " + err.message);
  }
};

// =============================
// ✏️ EDITAR FORMULÁRIO
// =============================
exports.editarForm = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).lean();
    if (!aluno) return res.status(404).send("Aluno não encontrado");
    const turmas = await Turma.find();
    res.render('alunos/editar', { aluno, turmas });
  } catch (err) {
    res.status(500).send("Erro ao buscar aluno: " + err.message);
  }
};

// =============================
// 🔄 ATUALIZAR ALUNO
// =============================
exports.editar = async (req, res) => {
  try {
    const updateData = {
      nome: req.body.nome || '',
      dataN: req.body.dataN,
      turma: req.body.turma,
      necessidadeE: req.body.necessidadeE || 'Nenhuma',
      problemaSaude: req.body.problemaSaude || 'Nenhum',
      disciplinaD: req.body.disciplinaD || 'Nenhuma',
      transferenciaOnde: req.body.transferenciaOnde || '',
      transferenciaD: req.body.transferenciaD || '',
      responsavelNome: req.body.responsavelNome || '',
      responsavelContato: req.body.responsavelContato || '',
      segundoProfessor: req.body.segundoProfessor === "on",
      segundoProfessorNome: req.body.segundoProfessorNome || '',
      observacao: req.body.observacao || ''
    };

    if (req.file) {
      updateData.foto = await processarFoto(req.file, 'alunos');
    }

    await Aluno.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.redirect('/alunos');
  } catch (err) {
    console.error("Erro ao editar aluno:", err);
    if (err.name === 'ValidationError') {
      res.status(400).send("Erro de validação: " + err.message);
    } else {
      res.status(500).send("Erro ao editar aluno: " + err.message);
    }
  }
};

// =============================
// 🔁 ATIVAR/DESATIVAR
// =============================
exports.toggleAtivo = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).send("Aluno não encontrado");

    aluno.ativo = !aluno.ativo;
    await aluno.save();
    res.redirect(aluno.ativo ? '/alunos' : '/alunos/inativo');
  } catch (err) {
    console.error("Erro ao alterar status:", err);
    if (err.name === 'ValidationError') {
      res.status(400).send("Erro de validação: " + err.message);
    } else {
      res.status(500).send("Erro ao alterar status: " + err.message);
    }
  }
};

// =============================
// 🔍 BUSCA
// =============================
exports.search = async (req, res) => {
  const query = req.query.q;
  try {
    const resultados = await Aluno.find({
      ativo: true,
      nome: { $regex: query, $options: 'i' } // apenas nome completo
    }).populate('turma').lean();

    res.render('alunos/lista', { alunos: resultados });
  } catch (err) {
    res.status(500).send("Erro ao buscar alunos: " + err.message);
  }
};

// =============================
// 🔍 BUSCA INATIVOS
// =============================
exports.searchInativos = async (req, res) => {
  const query = req.query.q;
  try {
    const resultados = await Aluno.find({
      ativo: false,
      nome: { $regex: query, $options: 'i' }
    }).populate('turma').lean();

    res.render('alunos/inativo', { alunos: resultados });
  } catch (err) {
    res.status(500).send("Erro ao buscar alunos inativos: " + err.message);
  }
};

// =============================
// 🗑️ DELETAR
// =============================
exports.deletar = async (req, res) => {
  try {
    await Aluno.findByIdAndDelete(req.params.id);
    res.redirect('/alunos');
  } catch (err) {
    res.status(500).send("Erro ao deletar aluno: " + err.message);
  }
};

// =============================
// 🔎 DETALHES
// =============================
exports.detalhes = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).populate('turma').lean();
    if (!aluno) return res.status(404).send("Aluno não encontrado");
    res.render('alunos/detalhes', { aluno });
  } catch (err) {
    res.status(500).send("Erro ao buscar detalhes do aluno: " + err.message);
  }
};
