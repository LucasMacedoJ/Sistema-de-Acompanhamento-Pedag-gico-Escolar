const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  periodo:{type: String, enum:['Manhã','Tarde'], required: true}
});

module.exports = mongoose.model('Turma', turmaSchema);
