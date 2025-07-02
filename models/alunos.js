const mongoose = require('mongoose');

// Criamos o Schema (estrutura de dados)
const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  turma: {type: String, required: true },
  dataN: { type: Number, required: true },
  necessidade: { type: Boolean, default: false },
  necesidadeE: { type: String },
  prolemaSaude: { type: String },
  apoia:{ type: Boolean, default: false },
  nepre:{typr: Boolean, default: false },
  disiplinar:{ type: boolean, default: false },
  disciplinaD: { type: String },
  traferencia:{ type: Boolean, default: false },
  traferenciaD: { type: String },
  traferenciaOnde: { type: String },
  segundoProfessor:{ type: Boolean, default: false },
  segundoProfessorNome: { type: String },
  observacao: { type: String },
  ocorencia: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ocorencia' }], // chave estrangeira para Ocorencia
  ativo:{ type: Boolean, default: true }
});

// Exportamos o model
module.exports = mongoose.model('Aluno', AlunoSchema);
