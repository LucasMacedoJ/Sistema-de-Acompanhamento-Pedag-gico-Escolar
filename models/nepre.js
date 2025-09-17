const mongoose = require('mongoose');

const NepreSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'Aluno', required: true },
  descricao: { type: String, required: true },
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date }
});

module.exports = mongoose.model('Nepre', NepreSchema);
