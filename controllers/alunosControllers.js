const Aluno = require('../models/alunos');

exports.formulario = (req, res) => {
  res.render('alunos/formulario');
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
    res.redirect('/alunos/lista');
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
    const Aluno = await Aluno.findById(req.params.id).lean();
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
    res.redirect('/alunos/lista');
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
    res.redirect('/alunos/lista');
  } catch (err) {
    res.send("Erro ao alterar status: " + err);
  }
};

exports.search = async (req, res) => {
  const query = req.query.q;
  try {
    const alunos = await Alunos.find({
      ativo: true,
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
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
    const alunos = await Alunos.find({
      ativo: false,
      $or: [
        { nome: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
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
    res.redirect('/alunos/lista');
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