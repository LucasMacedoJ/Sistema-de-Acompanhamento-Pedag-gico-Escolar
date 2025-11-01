// controllers/alunosController.js
const Aluno = require('../models/alunos');
const Turma = require('../models/turma');
const { uploadAlunos, processarFoto, removerFoto } = require('./fotoController');

// ============================
// 🔧 Função auxiliar
// ============================
function limparCamposArray(campo) {
  if (!campo) return [];
  if (!Array.isArray(campo)) campo = [campo];
  return campo
    .map(item => item.trim())
    .filter(item => item !== '')
    .map(item => item.replace(/,\s*$/, '')); // remove vírgula no final
}

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

    // 📸 Se houver upload de foto, processa e salva no diretório de alunos
    if (req.file) {
      fotoPath = await processarFoto(req.file, 'alunos');
    }

    // =============================
    // 🧠 NORMALIZA OS CAMPOS DE LISTA
    // =============================
    const necessidades = (Array.isArray(req.body.necessidadeE) ? req.body.necessidadeE : [req.body.necessidadeE])
      .map(item => item?.trim())
      .filter(item => item && item !== '') // remove vazios
      .map(item => item || 'Nenhum');

    const saude = (Array.isArray(req.body.problemaSaude) ? req.body.problemaSaude : [req.body.problemaSaude])
      .map(item => item?.trim())
      .filter(item => item && item !== '')
      .map(item => item || 'Nenhum');

    const dificuldades = (Array.isArray(req.body.disciplinaD) ? req.body.disciplinaD : [req.body.disciplinaD])
      .map(item => item?.trim())
      .filter(item => item && item !== '')
      .map(item => item || 'Nenhum');

    // Se o usuário não preencher nada, salva "Nenhum"
    const necessidadesFinal = necessidades.length ? necessidades : ['Nenhum'];
    const saudeFinal = saude.length ? saude : ['Nenhum'];
    const dificuldadesFinal = dificuldades.length ? dificuldades : ['Nenhum'];

    // =============================
    // 🧩 CRIA O NOVO ALUNO
    // =============================
    const novoAluno = new Aluno({
      nome: req.body.nome?.trim() || 'Nenhum',
      dataN: req.body.dataN || 'Nenhum',
      turma: req.body.turma || null,
      necessidadeE: necessidadesFinal,
      problemaSaude: saudeFinal,
      disciplinaD: dificuldadesFinal,
      transferenciaOnde: req.body.transferenciaOnde?.trim() || 'Nenhum',
      transferenciaD: req.body.transferenciaD?.trim() || 'Nenhum',
      responsavelNome: req.body.responsavelNome?.trim() || 'Nenhum',
      responsavelContato: req.body.responsavelContato?.trim() || 'Nenhum',
      segundoProfessor: req.body.segundoProfessor === 'on',
      segundoProfessorNome: req.body.segundoProfessorNome?.trim() || 'Nenhum',
      observacao: req.body.observacao?.trim() || 'Nenhum',
      foto: fotoPath
    });

    await novoAluno.save();
    console.log('✅ Aluno cadastrado com sucesso:', novoAluno.nome);
    res.redirect('/alunos');

  } catch (err) {
    console.error('❌ Erro ao salvar o aluno:', err);
    res.status(500).send('Erro ao salvar o aluno: ' + err.message);
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
// 🔄 ATUALIZAR ALUNO (com "Nenhum" padrão e sem vírgulas sobrando)
// =============================
exports.editar = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).send("Aluno não encontrado");

    // =============================
    // 🧠 Normalização dos campos de lista
    // =============================
    const necessidades = (Array.isArray(req.body.necessidadeE) ? req.body.necessidadeE : [req.body.necessidadeE])
      .map(item => item?.trim())
      .filter(item => item && item !== '')
      .map(item => item || 'Nenhum');
    const necessidadesFinal = necessidades.length ? necessidades : ['Nenhum'];

    const saude = (Array.isArray(req.body.problemaSaude) ? req.body.problemaSaude : [req.body.problemaSaude])
      .map(item => item?.trim())
      .filter(item => item && item !== '')
      .map(item => item || 'Nenhum');
    const saudeFinal = saude.length ? saude : ['Nenhum'];

    const dificuldades = (Array.isArray(req.body.disciplinaD) ? req.body.disciplinaD : [req.body.disciplinaD])
      .map(item => item?.trim())
      .filter(item => item && item !== '')
      .map(item => item || 'Nenhum');
    const dificuldadesFinal = dificuldades.length ? dificuldades : ['Nenhum'];

    // =============================
    // 📦 Monta os dados atualizados
    // =============================
    const updateData = {
      nome: req.body.nome?.trim() || 'Nenhum',
      dataN: req.body.dataN || 'Nenhum',
      turma: req.body.turma || null,
      necessidadeE: necessidadesFinal,
      problemaSaude: saudeFinal,
      disciplinaD: dificuldadesFinal,
      transferenciaOnde: req.body.transferenciaOnde?.trim() || 'Nenhum',
      transferenciaD: req.body.transferenciaD?.trim() || 'Nenhum',
      responsavelNome: req.body.responsavelNome?.trim() || 'Nenhum',
      responsavelContato: req.body.responsavelContato?.trim() || 'Nenhum',
      segundoProfessor: req.body.segundoProfessor === 'on',
      segundoProfessorNome: req.body.segundoProfessorNome?.trim() || 'Nenhum',
      observacao: req.body.observacao?.trim() || 'Nenhum'
    };

    // =============================
    // 🖼️ Atualização da foto (opcional)
    // =============================
    if (req.file) {
      if (aluno.foto) await removerFoto(aluno.foto);
      const novaFoto = await processarFoto(req.file, 'alunos');
      updateData.foto = novaFoto;
    }

    // =============================
    // 💾 Atualiza no banco
    // =============================
    await Aluno.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    console.log(`✅ Aluno "${updateData.nome}" atualizado com sucesso.`);
    res.redirect('/alunos');

  } catch (err) {
    console.error("❌ Erro ao editar aluno:", err);
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
