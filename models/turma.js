const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  periodo: { type: String, enum: ['Matutino', 'Vespertino', 'Noturno', 'Integral'], required: true }
});

module.exports = mongoose.model('Turma', turmaSchema);
