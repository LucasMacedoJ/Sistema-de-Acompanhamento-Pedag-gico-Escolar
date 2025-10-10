const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  // 🧩 Principais
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  dataN: { type: Date, required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },

  // 🧠 Sobre o aluno
  necessidadeE: { type: String },        // Ex.: TDAH, Dislexia
  problemaSaude: { type: String },       // Ex.: Asma
  disciplinaD: { type: String },         // Ex.: Agressividade, Falta de atenção

  // 🔁 Transferência
  transferenciaOnde: { type: String },   // Escola anterior
  transferenciaD: { type: String },      // Motivo ou detalhes

  // 👨‍👩‍👧 Responsáveis
  responsavelNome: { type: String, required: true },
  responsavelContato: { type: String, required: true },

  // 👩‍🏫 Segundo professor
  segundoProfessor: { type: Boolean, default: false },
  segundoProfessorNome: { type: String },

  // 📝 Observações gerais
  observacao: { type: String },

  // 🖼️ Foto do aluno
  foto: {
    type: String,       // Caminho da imagem (ex: "/uploads/alunos/foto-123.jpg")
    default: null
  },

  // 📋 Ocorrências
  ocorrencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ocorrencia' }],

  // ⚙️ Status
  ativo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Aluno', AlunoSchema);
