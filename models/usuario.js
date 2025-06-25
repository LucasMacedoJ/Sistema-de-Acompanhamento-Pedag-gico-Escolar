const mongoose = require('mongoose');

// Criamos o Schema (estrutura de dados)
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, required: true },
  idade: { type: Number, required: true },
  pais: { type: String },
  ativo:{ type: Boolean, default: true }
});

// Exportamos o model
module.exports = mongoose.model('Usuario', UsuarioSchema);
