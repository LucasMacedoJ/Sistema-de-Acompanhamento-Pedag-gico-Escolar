const Ocorrencia = require('../models/ocorrencias');

// Exibe o formulário de nova ocorrência
exports.nova = (req, res) => {
  return res.render('ocorrencias/nova', { 
    usuario: req.session.usuario || null,
    alunoId: req.query.aluno || null,
    erro: null
  });
};

// Cadastra uma nova ocorrência
exports.cadastrar = async (req, res) => {
  try {
    const { aluno, tipo, descricao, responsavel, encaminhamento, resultado } = req.body;

    if (!aluno || !descricao || !responsavel) {
      return res.render('ocorrencias/nova', { 
        usuario: req.session.usuario || null,
        alunoId: aluno || null,
        erro: 'Preencha todos os campos obrigatórios (aluno, descrição e responsável).'
      });
    }

    const novaOcorrencia = new Ocorrencia({
      aluno,
      tipo: tipo || 'GERAL',
      descricao,
      responsavel,
      encaminhamento: encaminhamento || '',
      resultado: resultado || '',
      dataAbertura: new Date(),
      status: 'ABERTA',
      ativo: true
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

// Lista ocorrências (todas, por aluno ou por tipo)
exports.listaOcorrencias = async (req, res) => {
  try {
    const { aluno: alunoId, tipo } = req.query;

    const filtro = { ativo: true };
    if (alunoId) filtro.aluno = alunoId;
    if (tipo && tipo !== 'TODOS') filtro.tipo = tipo;

    const ocorrencias = await Ocorrencia.find(filtro)
      .populate('aluno')
      .sort({ dataAbertura: -1 })
      .lean();

    const aluno = alunoId && ocorrencias.length > 0 ? ocorrencias[0].aluno : null;

    return res.render('ocorrencias/lista', { 
      usuario: req.session.usuario || null,
      ocorrencias,
      aluno,
      tipoSelecionado: tipo || 'TODOS'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao buscar ocorrências: " + err.message);
  }
};

// Exibe os detalhes de uma ocorrência
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

// Encerra uma ocorrência
exports.encerrar = async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado } = req.body;

    const ocorrencia = await Ocorrencia.findById(id);
    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }

    ocorrencia.resultado = resultado || ocorrencia.resultado;
    ocorrencia.dataEncerramento = new Date();
    ocorrencia.status = 'ENCERRADA';

    await ocorrencia.save();

    return res.redirect(`/ocorrencias/detalhes/${id}`);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao encerrar ocorrência: " + err.message);
  }
};
