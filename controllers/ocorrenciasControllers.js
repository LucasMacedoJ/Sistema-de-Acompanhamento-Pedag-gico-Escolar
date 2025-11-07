const Ocorrencia = require('../models/ocorrencias');

/* =========================================================
   📌 FORMULÁRIOS
   ========================================================= */

// Formulário de nova ocorrência
exports.nova = (req, res) => {
  res.render('ocorrencias/nova', {
    usuario: req.session.usuario || null,
    alunoId: req.query.aluno || null,
    erro: null
  });
};

// Formulário de edição
exports.formEditar = async (req, res) => {
  try {
    const { id } = req.params;

    const ocorrencia = await Ocorrencia.findById(id)
      .populate('aluno')
      .lean();

    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }

    res.render('ocorrencias/editar', {
      usuario: req.session.usuario || null,
      ocorrencia,
      erro: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar ocorrência: " + err.message);
  }
};

/* =========================================================
   📌 CADASTRO
   ========================================================= */

exports.cadastrar = async (req, res) => {
  try {
    const { aluno, tipo, descricao, responsavel, encaminhamento, resultado } = req.body;

    // Validação mínima
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
      dataEncerramento: null,
      status: 'ABERTA',
      ativo: true
    });

    await novaOcorrencia.save();

    res.render('ocorrencias/sucesso', {
      usuario: req.session.usuario || null,
      ocorrencia: novaOcorrencia
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar a Ocorrência: " + err.message);
  }
};

/* =========================================================
   📌 LISTAGEM E DETALHES
   ========================================================= */

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

    // Se há ocorrências filtradas por aluno, pegar o aluno do primeiro
    const aluno = alunoId && ocorrencias.length > 0 ? ocorrencias[0].aluno : null;

    res.render('ocorrencias/lista', {
      usuario: req.session.usuario || null,
      ocorrencias,
      aluno,
      tipoSelecionado: tipo || 'TODOS'
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar ocorrências: " + err.message);
  }
};

exports.detalhesOcorrencia = async (req, res) => {
  try {
    const { id } = req.params;

    const ocorrencia = await Ocorrencia.findById(id)
      .populate('aluno')
      .lean();

    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }

    res.render('ocorrencias/detalhes', {
      usuario: req.session.usuario || null,
      ocorrencia
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar ocorrência: " + err.message);
  }
};

/* =========================================================
   📌 EDIÇÃO
   ========================================================= */

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, descricao, responsavel, encaminhamento, resultado, status } = req.body;

    const ocorrencia = await Ocorrencia.findById(id);
    if (!ocorrencia) {
      return res.status(404).send("Ocorrência não encontrada");
    }

    // Atualizar apenas campos recebidos
    ocorrencia.tipo = tipo || ocorrencia.tipo;
    ocorrencia.descricao = descricao || ocorrencia.descricao;
    ocorrencia.responsavel = responsavel || ocorrencia.responsavel;
    ocorrencia.encaminhamento = encaminhamento || ocorrencia.encaminhamento;
    ocorrencia.resultado = resultado || ocorrencia.resultado;
    ocorrencia.status = status || ocorrencia.status;

    await ocorrencia.save();

    res.redirect(`/ocorrencias/detalhes/${id}`);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar ocorrência: " + err.message);
  }
};

/* =========================================================
   📌 ENCERRAMENTO
   ========================================================= */

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

    res.redirect(`/ocorrencias/detalhes/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao encerrar ocorrência: " + err.message);
  }
};
