const mongoose = require('mongoose');

const ApoiaSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Apoia', ApoiaSchema);