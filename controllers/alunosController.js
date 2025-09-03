const Aluno = require('../models/aluno');

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