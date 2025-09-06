const Aluno = require('../models/alunos');
const Turma = require('../models/turma');

exports.formulario = async (req, res) => {
  try {
    const turmas = await Turma.find();
    res.render('alunos/formulario', { turmas });
  } catch (err) {
    console.error('Erro ao carregar turmas:', err);
    res.status(500).send('Erro ao carregar formulário.');
  }
};

exports.cadastrar = async (req, res) => {
  try {
    const novoAluno = new Aluno({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      turma: req.body.turma,
      dataN: req.body.dataN,
      necessidade: req.body.necessidade === "on",
      necesidadeE: req.body.necesidadeE,
      problemaSaude: req.body.problemaSaude,
      apoia: req.body.apoia === "on",
      nepre: req.body.nepre === "on",
      disiplinar: req.body.disiplinar === "on",
      disciplinaD: req.body.disiplinarD,
      traferencia: req.body.traferencia === "on",
      traferenciaD: req.body.trasferenciaD,
      traferenciaOnde: req.body.trasfenciaOnde,
      segundoProfessor: req.body.segundoProfessor === "on",
      segundoProfessorNome: req.body.segundoProfessorNome,
      observacao: req.body.observacao
    });
    await novoAluno.save();
    res.redirect('/alunos');
  } catch (err) {
    res.send("erro ao salvar o aluno:" + err);
  }
};

exports.lista = async (req, res) => {
  try {
    const alunos = await Aluno.find({ ativo: true }).lean();
    res.render('alunos/lista', { alunos });
  } catch (err) {
    res.send("Erro ao listar alunos: " + err);
  }
};

exports.inativo = async (req, res) => {
  try {
    const alunosInativos = await Aluno.find({ ativo: false }).lean();
    res.render('alunos/inativo', { alunos: alunosInativos });
  } catch (err) {
    res.send("Erro ao listar alunos inativos: " + err);
  }
};

exports.editarForm = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).lean();
    if (!aluno) return res.status(404).send("aluno não encontrado");
    res.render('alunos/editar', { aluno });
  } catch (err) {
    res.send("Erro ao buscar usuário: " + err);
  }
};

exports.editar = async (req, res) => {
  try {
    await Aluno.findByIdAndUpdate(req.params.id, {
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      idade: req.body.idade,
      pais: req.body.pais
    });
    res.redirect('/alunos');
  } catch (err) {
    res.send("Erro ao editar alunos: " + err);
  }
};

exports.toggleAtivo = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).send("Usuário não encontrado");
    aluno.ativo = !aluno.ativo;
    await aluno.save();
    res.redirect('/alunos');
  } catch (err) {
    res.send("Erro ao alterar status: " + err);
  }
};

exports.search = async (req, res) => {
  const query = req.query.q;
  try {
    const alunos = await Aluno.find({
      ativo: true,
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { sobrenome: { $regex: query, $options: 'i' } },
        { turma: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.render('alunos/lista', { alunos });
  } catch (err) {
    res.send("Erro ao buscar alunos: " + err);
  }
};

exports.searchInativos = async (req, res) => {
  const query = req.query.q;
  try {
    const alunos = await Aluno.find({
      ativo: false,
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { sobrenome: { $regex: query, $options: 'i' } },
        { turma: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.render('alunos/inativo', { alunos });
  } catch (err) {
    res.send("Erro ao buscar alunos inativos: " + err);
  }
};

exports.deletar = async (req, res) => {
  try {
    await Aluno.findByIdAndDelete(req.params.id);
    res.redirect('/alunos');
  } catch (err) {
    res.send("Erro ao deletar aluno: " + err);
  }
};

exports.detalhes = async (req, res) => {
  try{
    const aluno = await Aluno.findById(req.params.id).lean();
    if (!aluno) return res.status(404).send("aluno não encontrado");
    res.render('alunos/detalhes', { aluno });
  } catch (err) {
    res.send("Erro ao buscar detalhes do aluno: " + err);
  }
};

exports.listarAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find().populate('turma');
    res.render('alunos/lista', { alunos });
  } catch (err) {
    res.status(500).send('Erro ao listar alunos');
  }
};

exports.formularioCadastro = (req, res) => {
  res.render('alunos/formulario', { turmas: [] });
};

exports.cadastrarAluno = async (req, res) => {
  const { nome, sobrenome, turma, dataN, necesidadE, problemaSaude, apoia, nepre, disiplinarD, trasfenciaOnde, trasferenciaD, segundoProfessor, segundoProfessorNome, observacao } = req.body;
  
  try {
    await Aluno.create({ nome, sobrenome, turma, dataN, necesidadE, problemaSaude, apoia, nepre, disiplinarD, trasfenciaOnde, trasferenciaD, segundoProfessor, segundoProfessorNome, observacao });
    res.redirect('/alunos/');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar aluno');
  }
};

exports.detalhesAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).populate('turma');
    res.render('alunos/detalhes', { aluno });
  } catch (err) {
    res.status(500).send('Erro ao buscar detalhes do aluno');
  }
};

exports.editarAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    res.render('alunos/editar', { aluno });
  } catch (err) {
    res.status(500).send('Erro ao buscar aluno para edição');
  }
};

exports.atualizarAluno = async (req, res) => {
  const { nome, sobrenome, turma, dataN, necesidadE, problemaSaude, apoia, nepre, disiplinarD, trasfenciaOnde, trasferenciaD, segundoProfessor, segundoProfessorNome, observacao } = req.body;
  
  try {
    await Aluno.findByIdAndUpdate(req.params.id, { nome, sobrenome, turma, dataN, necesidadE, problemaSaude, apoia, nepre, disiplinarD, trasfenciaOnde, trasferenciaD, segundoProfessor, segundoProfessorNome, observacao });
    res.redirect('/alunos/');
  } catch (err) {
    res.status(500).send('Erro ao atualizar aluno');
  }
};

// Remova ou comente a função de deletar:
// exports.deletarAluno = async (req, res) => {
//   try {
//     await Aluno.findByIdAndDelete(req.params.id);
//     res.redirect('/alunos/');
//   } catch (err) {
//     res.status(500).send('Erro ao excluir aluno');
//   }
// };