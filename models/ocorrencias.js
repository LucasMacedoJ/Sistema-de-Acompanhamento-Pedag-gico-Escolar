const mongoose = require('mongoose');

const OcorrenciaSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Aluno', required: true },

  tipo: { type: String, enum: ['GERAL', 'APOIA', 'NEPRE', 'DISCIPLINAR', 'TRANSFERENCIA'], default: 'GERAL', required: true },

  descricao: { type: String, required: true, trim: true },

  dataAbertura: { type: Date, default: Date.now },

  dataEncerramento: { type: Date, default: null },

  responsavel: { type: String, required: true },

  resultado: { type: String },

  encaminhamento: { type: String },

  dataEncerramento: { type: Date },

  status: { type: String, enum: ['ABERTA', 'ENCERRADA'], default: 'ABERTA' },

  ativo: { type: Boolean, default: true }
});

// Atualiza status automaticamente se houver data de encerramento
OcorrenciaSchema.pre('save', function (next) {
  if (this.dataEncerramento) {
    this.status = 'ENCERRADA';
  }
  next();
});

module.exports = mongoose.model('Ocorrencia', OcorrenciaSchema);
