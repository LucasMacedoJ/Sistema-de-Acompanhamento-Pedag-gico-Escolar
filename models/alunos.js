const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  // Principais
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  dataN: { type: Date, required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },

  // Sobre o aluno
  necessidadeE: { type: String },        // Ex.: TDAH, Dislexia
  problemaSaude: { type: String },       // Ex.: Asma
  disciplinaD: { type: String },         // Problema disciplinar

  // Transferência
  transferenciaOnde: { type: String },   // De qual escola veio
  transferenciaD: { type: String },      // Motivo ou descrição

  // Responsáveis
  responsavelNome: { type: String, required: true },
  responsavelContato: { type: String, required: true },

  // Segundo professor
  segundoProfessor: { type: Boolean, default: false },
  segundoProfessorNome: { type: String },

  // Observações gerais
  observacao: { type: String },

  // Ocorrências
  ocorrencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ocorrencia' }],

  // Status do aluno
  ativo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Aluno', AlunoSchema);
