const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  // 🧩 Principais
  nome: { type: String, required: true }, // Nome completo
  dataN: { type: Date, required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },

  // 🧠 Sobre o aluno
  necessidadeE: {
    type: String,
    enum: [
      'Nenhuma',
      'TDAH',
      'Autismo',
      'Dislexia',
      'Deficiência visual',
      'Deficiência auditiva',
      'Deficiência física',
      'Outro'
    ],
    default: 'Nenhuma'
  },
  necessidadeEOutro: { type: String },

  problemaSaude: {
    type: String,
    enum: [
      'Nenhum',
      'Asma',
      'Epilepsia',
      'Diabetes',
      'Alergia',
      'Outro'
    ],
    default: 'Nenhum'
  },
  problemaSaudeOutro: { type: String },

  disciplinaD: {
    type: String,
    enum: [
      'Nenhuma',
      'Falta de atenção',
      'Agressividade',
      'Desinteresse',
      'Dificuldade de concentração',
      'Outro'
    ],
    default: 'Nenhuma'
  },
  disciplinaDOutro: { type: String },

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
