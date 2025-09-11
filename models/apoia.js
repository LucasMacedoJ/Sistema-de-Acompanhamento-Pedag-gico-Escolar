const mongoose = require('mongoose');

const ApoiaSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Aluno', required: true },
  descricao: { type: String, required: true },
  dataInicio: { type: Date, default: Date.now },
  dataFim: { type: Date }
});

module.exports = mongoose.model('Apoia', ApoiaSchema);
