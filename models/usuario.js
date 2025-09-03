const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  perfil: { type: String, enum: ['admin', 'comum'], default: 'comum' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);