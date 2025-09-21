const Ocorrencia = require('../models/ocorrencias'); // ajuste conforme o nome do model

// Exibe o formulário de nova ocorrência
exports.nova = (req, res) => {
  return res.render('ocorrencias/nova', { 
    usuario: req.session.usuario || null,
    alunoId: req.query.aluno || null 
  });
};

// Cadastra uma nova ocorrência
exports.cadastrar = async (req, res) => {
  try {
    const { aluno, descricao, data } = req.body;

    if (!descricao || !data) {
      return res.render('ocorrencias/nova', { 
        usuario: req.session.usuario || null,
        alunoId: aluno || null,
        erro: 'Preencha todos os campos obrigatórios.' 
      });
    }

    const novaOcorrencia = new Ocorrencia({
      aluno: aluno || null, 
      descricao,
      data
    });

    await novaOcorrencia.save();

    return res.render('ocorrencias/sucesso', { 
      usuario: req.session.usuario || null,
      ocorrencia: novaOcorrencia 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao salvar a Ocorrência: " + err.message);
  }
};

// Lista ocorrências (todas ou de um aluno específico)
exports.listaOcorrencias = async (req, res) => {
  const alunoId = req.query.aluno;
  try {
    const filtro = alunoId ? { aluno: alunoId } : {};
    const ocorrencias = await Ocorrencia.find(filtro)
      .populate('aluno') // só se houver referência no schema
      .lean();

    const aluno = alunoId && ocorrencias.length > 0 ? ocorrencias[0].aluno : null;

    return res.render('ocorrencias/lista', { 
      usuario: req.session.usuario || null,
      ocorrencias, 
      aluno 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao buscar ocorrências: " + err.message);
  }
};

// Exibe os detalhes de uma ocorrência específica
exports.detalhesOcorrencia = async (req, res) => {
  try {
    const { id } = req.params;
    const ocorrencia = await Ocorrencia.findById(id)
      .populate('aluno')
      .lean();

    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }

    return res.render('ocorrencias/detalhes', { 
      usuario: req.session.usuario || null,
      ocorrencia 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao buscar ocorrência: " + err.message);
  }
};
