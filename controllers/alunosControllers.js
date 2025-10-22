const Aluno = require('../models/alunos');
const Turma = require('../models/turma');
const { upload, processarFoto, removerFoto } = require('./fotoController');

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
    if (!req.body.nome || !req.body.sobrenome) {
      return res.status(400).send("Nome e sobrenome são obrigatórios");
    }

    let fotoPath = null;
    if (req.file) {
      fotoPath = await processarFoto(req.file);
    }

    const novoAluno = new Aluno({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      dataN: req.body.dataN,
      turma: req.body.turma,
      necessidadeE: req.body.necessidadeE,
      problemaSaude: req.body.problemaSaude,
      disciplinaD: req.body.disciplinaD,
      transferenciaOnde: req.body.transferenciaOnde,
      transferenciaD: req.body.transferenciaD,
      responsavelNome: req.body.responsavelNome,
      responsavelContato: req.body.responsavelContato,
      segundoProfessor: req.body.segundoProfessor === "on",
      segundoProfessorNome: req.body.segundoProfessorNome,
      observacao: req.body.observacao,
      foto: fotoPath
    });

    await novoAluno.save();
    res.redirect('/alunos');
  } catch (err) {
    console.error("Erro ao salvar o aluno:", err);
    res.status(500).send("Erro ao salvar o aluno: " + err.message);
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
    res.send("Erro ao listar alunos: " + err);
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
    res.send("Erro ao listar alunos inativos: " + err);
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
    res.send("Erro ao buscar aluno: " + err);
  }
};

// =============================
// 🔄 ATUALIZAR ALUNO
// =============================
exports.editar = async (req, res) => {
  try {
    const updateData = {
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      dataN: req.body.dataN,
      turma: req.body.turma,
      necessidadeE: req.body.necessidadeE,
      problemaSaude: req.body.problemaSaude,
      disciplinaD: req.body.disciplinaD,
      transferenciaOnde: req.body.transferenciaOnde,
      transferenciaD: req.body.transferenciaD,
      responsavelNome: req.body.responsavelNome,
      responsavelContato: req.body.responsavelContato,
      segundoProfessor: req.body.segundoProfessor === "on",
      segundoProfessorNome: req.body.segundoProfessorNome,
      observacao: req.body.observacao
    };

    if (req.file) {
      updateData.foto = await processarFoto(req.file);
    }

    await Aluno.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/alunos');
  } catch (err) {
    res.status(500).send("Erro ao editar aluno: " + err.message);
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
    res.send("Erro ao alterar status: " + err);
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
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { sobrenome: { $regex: query, $options: 'i' } }
      ]
    }).populate('turma').lean();

    res.render('alunos/lista', { alunos: resultados });
  } catch (err) {
    res.send("Erro ao buscar alunos: " + err);
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
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { sobrenome: { $regex: query, $options: 'i' } }
      ]
    }).populate('turma').lean();

    res.render('alunos/inativo', { alunos: resultados });
  } catch (err) {
    res.send("Erro ao buscar alunos inativos: " + err);
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
    res.send("Erro ao deletar aluno: " + err);
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
    res.send("Erro ao buscar detalhes do aluno: " + err);
  }
};
