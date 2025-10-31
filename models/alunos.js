const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  // 🧩 Principais
  nome: { type: String, required: true }, // Nome completo
  dataN: { type: Date, required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },

  // 🧠 Sobre o aluno
  necessidadeE: {
    type: [String], // agora qualquer string é aceita
    default: []     // pode adicionar várias
  },


  problemaSaude: {
    type: [String], // agora qualquer string é aceita
    default: []     // pode adicionar várias
  },


  disciplinaD: {
    type: [String], // agora qualquer string é aceita
    default: []     // pode adicionar várias
  },

  // 🔁 Transferência
  transferenciaOnde: { type: String },
  transferenciaD: { type: String },

  // 👨‍👩‍👧 Responsáveis
  responsavelNome: { type: String, required: true },
  responsavelContato: { type: String, required: true },

  // 👩‍🏫 Segundo professor
  segundoProfessor: { type: Boolean, default: false },
  segundoProfessorNome: { type: String },

  // 📝 Observações gerais
  observacao: { type: String },

  // 🖼️ Foto do aluno
  foto: { type: String, default: null },

  // 📋 Ocorrências
  ocorrencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ocorrencia' }],

  // ⚙️ Status
  ativo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Aluno', AlunoSchema);
