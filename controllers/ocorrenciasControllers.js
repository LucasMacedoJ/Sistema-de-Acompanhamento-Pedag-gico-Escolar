const Ocorrencia = require('../models/ocorrencias'); // ajuste conforme o nome do arquivo do model

// Exibe o formulário de nova ocorrência
exports.nova = (req, res) => {
  res.render('ocorrencias/nova', { alunoId: req.query.aluno });
};

// Cadastra uma nova ocorrência
exports.cadastrar = async (req, res) => {
  try {
    const novaOcorrencia = new Ocorrencia({
      aluno: req.body.aluno,       // se houver relação com aluno
      descricao: req.body.descricao,
      data: req.body.data
    });

    await novaOcorrencia.save();
    res.render("ocorrencias/SUCESSO", { ocorrencia: novaOcorrencia });
  } catch (err) {
    console.error(err);
    res.send("Erro ao salvar a Ocorrência: " + err.message);
  }
};

// Lista ocorrências (de todos ou de um aluno específico)
exports.listaOcorrencias = async (req, res) => {
  const alunoId = req.query.aluno;
  let ocorrencias = [];
  let aluno = null;

  try {
    const filtro = alunoId ? { aluno: alunoId } : {};
    ocorrencias = await Ocorrencia.find(filtro)
      .populate('aluno') // só se houver referência a aluno no schema
      .lean();

    // Se houver alunoId e registros, pega o primeiro aluno
    if (alunoId && ocorrencias.length > 0) {
      aluno = ocorrencias[0].aluno;
    }

    res.render('ocorrencias/listaOcorrencias', { ocorrencias, aluno });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar ocorrências: " + err.message);
  }
};

// Exibe os detalhes de uma ocorrência específica
exports.detalhesOcorrencia = async (req, res) => {
  const ocorrenciaId = req.params.id;

  try {
    const ocorrencia = await Ocorrencia.findById(ocorrenciaId)
      .populate('aluno') // só se houver referência a aluno
      .lean();

    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }

    res.render('ocorrencias/detalhesOcorrencias', { ocorrencia });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar ocorrência: " + err.message);
  }
};
