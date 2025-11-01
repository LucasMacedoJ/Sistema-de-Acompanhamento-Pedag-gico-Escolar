// controllers/alunosController.js
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

    // ✅ Corrigido: definindo as variáveis corretamente
    const necessidades = Array.isArray(req.body.necessidadeE)
      ? req.body.necessidadeE
      : [req.body.necessidadeE].filter(Boolean);

    const saude = Array.isArray(req.body.problemaSaude)
      ? req.body.problemaSaude
      : [req.body.problemaSaude].filter(Boolean);

    const dificuldades = Array.isArray(req.body.disciplinaD)
      ? req.body.disciplinaD
      : [req.body.disciplinaD].filter(Boolean);

    const novoAluno = new Aluno({
      nome: req.body.nome || '',
      dataN: req.body.dataN,
      turma: req.body.turma,
      necessidadeE: necessidades,
      problemaSaude: saude,
      disciplinaD: dificuldades,
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
// ✏️ FORMULÁRIO DE EDIÇÃO
// =============================
exports.editarForm = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).lean();
    if (!aluno) return res.status(404).send("Aluno não encontrado");
    const turmas = await Turma.find();

    // 🧩 Garante que os campos são arrays
    aluno.necessidadeE = Array.isArray(aluno.necessidadeE) ? aluno.necessidadeE : (aluno.necessidadeE ? [aluno.necessidadeE] : []);
    aluno.problemaSaude = Array.isArray(aluno.problemaSaude) ? aluno.problemaSaude : (aluno.problemaSaude ? [aluno.problemaSaude] : []);
    aluno.disciplinaD = Array.isArray(aluno.disciplinaD) ? aluno.disciplinaD : (aluno.disciplinaD ? [aluno.disciplinaD] : []);

    res.render('alunos/editar', { aluno, turmas });
  } catch (err) {
    res.status(500).send("Erro ao buscar aluno: " + err.message);
  }
};


// =============================
// 🔄 ATUALIZAR ALUNO (com "Nenhum" padrão)
// =============================
exports.editar = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).send("Aluno não encontrado");

    // 🧩 Necessidades Especiais
    let necessidades = [];
    if (req.body.necessidadeE) {
      necessidades = Array.isArray(req.body.necessidadeE)
        ? req.body.necessidadeE.filter(n => n.trim() !== '')
        : [req.body.necessidadeE].filter(Boolean);
    }
    if (necessidades.length === 0) necessidades = ['Nenhum'];

    // 🩺 Problemas de Saúde
    let saude = [];
    if (req.body.problemaSaude) {
      saude = Array.isArray(req.body.problemaSaude)
        ? req.body.problemaSaude.filter(s => s.trim() !== '')
        : [req.body.problemaSaude].filter(Boolean);
    }
    if (saude.length === 0) saude = ['Nenhum'];

    // 📚 Dificuldades Disciplinares
    let dificuldades = [];
    if (req.body.disciplinaD) {
      dificuldades = Array.isArray(req.body.disciplinaD)
        ? req.body.disciplinaD.filter(d => d.trim() !== '')
        : [req.body.disciplinaD].filter(Boolean);
    }
    if (dificuldades.length === 0) dificuldades = ['Nenhum'];

    // 📦 Dados a atualizar
    const updateData = {
      nome: req.body.nome || '',
      dataN: req.body.dataN,
      turma: req.body.turma,
      necessidadeE: necessidades,
      problemaSaude: saude,
      disciplinaD: dificuldades,
      transferenciaOnde: req.body.transferenciaOnde || '',
      transferenciaD: req.body.transferenciaD || '',
      responsavelNome: req.body.responsavelNome || '',
      responsavelContato: req.body.responsavelContato || '',
      segundoProfessor: req.body.segundoProfessor === "on",
      segundoProfessorNome: req.body.segundoProfessorNome || '',
      observacao: req.body.observacao || ''
    };

    // 🖼️ Atualização da foto
    if (req.file) {
      if (aluno.foto) await removerFoto(aluno.foto);
      const novaFoto = await processarFoto(req.file, 'alunos');
      updateData.foto = novaFoto;
    }

    await Aluno.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.redirect('/alunos');
  } catch (err) {
    console.error("Erro ao editar aluno:", err);
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
    console.error("Erro ao alterar status:", err);
    res.status(500).send("Erro ao alterar status: " + err.message);
  }
};

// =============================
// 🔍 BUSCA (ATIVOS)
// =============================
exports.search = async (req, res) => {
  const query = req.query.q || '';
  try {
    const resultados = await Aluno.find({
      ativo: true,
      nome: { $regex: query, $options: 'i' }
    }).populate('turma').lean();

    res.render('alunos/lista', { alunos: resultados });
  } catch (err) {
    res.status(500).send("Erro ao buscar alunos: " + err.message);
  }
};

// =============================
// 🔍 BUSCA (INATIVOS)
// =============================
exports.searchInativos = async (req, res) => {
  const query = req.query.q || '';
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
// 🗑️ DELETAR ALUNO
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
// 🔎 DETALHES DO ALUNO
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
